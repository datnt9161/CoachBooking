package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.config.PaymentConfig;
import com.example.demo.dto.booking.BookingRequest;
import com.example.demo.dto.booking.BookingResponse;
import com.example.demo.dto.booking.PaymentQRResponse;
import com.example.demo.dto.booking.PaymentRequest;
import com.example.demo.dto.seat.SeatResponse;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Trip;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final PaymentConfig paymentConfig;

    public BookingService(BookingRepository bookingRepository, TripRepository tripRepository,
                          SeatRepository seatRepository, UserRepository userRepository,
                          PaymentConfig paymentConfig) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.paymentConfig = paymentConfig;
    }

    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book past trips");
        }

        // Lock seats to prevent double booking (NFR-05)
        List<Seat> seats = seatRepository.findByIdInWithLock(request.getSeatIds());

        if (seats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Some seats not found");
        }

        for (Seat seat : seats) {
            if (seat.getStatus() != Seat.SeatStatus.AVAILABLE) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is not available");
            }
            if (!seat.getTrip().getId().equals(trip.getId())) {
                throw new BadRequestException("Seat does not belong to this trip");
            }
        }

        // Update seat status
        seats.forEach(seat -> seat.setStatus(Seat.SeatStatus.BOOKED));
        seatRepository.saveAll(seats);

        // Calculate total price
        BigDecimal totalPrice = trip.getPrice().multiply(BigDecimal.valueOf(seats.size()));

        // Create booking
        Booking booking = Booking.builder()
                .bookingCode(generateBookingCode())
                .user(user)
                .trip(trip)
                .seats(seats)
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .build();

        bookingRepository.save(booking);
        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse processPayment(Long userId, PaymentRequest request) {
        Booking booking = bookingRepository.findByIdWithDetails(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to booking");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in pending status");
        }

        booking.setPaymentMethod(Booking.PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        // Set to PAID status - waiting for admin confirmation
        booking.setStatus(Booking.BookingStatus.PAID);
        booking.setPaidAt(LocalDateTime.now());

        bookingRepository.save(booking);
        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getTrip().getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel past trips");
        }

        // Release seats
        booking.getSeats().forEach(seat -> seat.setStatus(Seat.SeatStatus.AVAILABLE));
        seatRepository.saveAll(booking.getSeats());

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        bookingRepository.save(booking);
        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdWithDetails(userId).stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to booking");
        }

        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public PaymentQRResponse getPaymentQR(Long userId, Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to booking");
        }

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in pending status");
        }

        PaymentConfig.QRConfig qrConfig;
        String method = paymentMethod.toUpperCase();

        switch (method) {
            case "MOMO":
                qrConfig = paymentConfig.getMomo();
                break;
            case "BANK_TRANSFER":
                qrConfig = paymentConfig.getBank();
                break;
            case "VNPAY":
                qrConfig = paymentConfig.getVnpay();
                break;
            default:
                throw new BadRequestException("Invalid payment method for QR: " + paymentMethod);
        }

        String transferContent = "COACHBOOKING " + booking.getBookingCode();

        return PaymentQRResponse.builder()
                .bookingCode(booking.getBookingCode())
                .paymentMethod(method)
                .qrCodeUrl(qrConfig.getQrCodeUrl())
                .accountName(qrConfig.getAccountName())
                .accountNumber(qrConfig.getAccountNumber())
                .bankName(qrConfig.getBankName())
                .transferContent(transferContent)
                .amount(booking.getTotalPrice())
                .build();
    }

    private String generateBookingCode() {
        return "CB" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BookingResponse toBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .departure(booking.getTrip().getRoute().getDeparture())
                .destination(booking.getTrip().getRoute().getDestination())
                .departureTime(booking.getTrip().getDepartureTime())
                .coachType(booking.getTrip().getCoach().getType().name())
                .licensePlate(booking.getTrip().getCoach().getLicensePlate())
                .seats(booking.getSeats().stream()
                        .map(s -> SeatResponse.builder()
                                .id(s.getId())
                                .seatNumber(s.getSeatNumber())
                                .status(s.getStatus().name())
                                .build())
                        .collect(Collectors.toList()))
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .paymentMethod(booking.getPaymentMethod() != null ? booking.getPaymentMethod().name() : null)
                .createdAt(booking.getCreatedAt())
                .paidAt(booking.getPaidAt())
                .build();
    }
}
