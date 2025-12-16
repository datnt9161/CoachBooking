package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.admin.CoachRequest;
import com.example.demo.dto.admin.RouteRequest;
import com.example.demo.dto.admin.TripRequest;
import com.example.demo.dto.booking.BookingResponse;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Coach;
import com.example.demo.entity.Route;
import com.example.demo.entity.Seat;
import com.example.demo.entity.Trip;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CoachRepository;
import com.example.demo.repository.RouteRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.TripRepository;

@Service
public class AdminService {

    private final RouteRepository routeRepository;
    private final CoachRepository coachRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public AdminService(RouteRepository routeRepository, CoachRepository coachRepository,
                        TripRepository tripRepository, SeatRepository seatRepository,
                        BookingRepository bookingRepository) {
        this.routeRepository = routeRepository;
        this.coachRepository = coachRepository;
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
    }

    // ==================== BOOKING MANAGEMENT ====================
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vé với mã: " + bookingCode));
        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
        booking.setStatus(newStatus);
        
        // If confirmed, update seat status to BOOKED
        if (newStatus == Booking.BookingStatus.CONFIRMED) {
            booking.getSeats().forEach(seat -> seat.setStatus(Seat.SeatStatus.BOOKED));
        }
        // If cancelled, release seats
        if (newStatus == Booking.BookingStatus.CANCELLED) {
            booking.getSeats().forEach(seat -> seat.setStatus(Seat.SeatStatus.AVAILABLE));
        }
        
        return toBookingResponse(bookingRepository.save(booking));
    }

    private BookingResponse toBookingResponse(Booking booking) {
        Trip trip = booking.getTrip();
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .departure(trip.getRoute().getDeparture())
                .destination(trip.getRoute().getDestination())
                .departureTime(trip.getDepartureTime())
                .coachType(trip.getCoach().getType().name())
                .licensePlate(trip.getCoach().getLicensePlate())
                .seatNumbers(booking.getSeats().stream().map(Seat::getSeatNumber).collect(Collectors.toList()))
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .passengerName(booking.getUser().getFullName())
                .passengerPhone(booking.getUser().getPhone())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    // ==================== ROUTE MANAGEMENT ====================
    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Transactional
    public Route createRoute(RouteRequest request) {
        if (routeRepository.findByDepartureAndDestination(request.getDeparture(), request.getDestination()).isPresent()) {
            throw new BadRequestException("Route already exists");
        }
        Route route = Route.builder()
                .departure(request.getDeparture())
                .destination(request.getDestination())
                .distance(request.getDistance())
                .estimatedDuration(request.getEstimatedDuration())
                .build();
        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        route.setDeparture(request.getDeparture());
        route.setDestination(request.getDestination());
        route.setDistance(request.getDistance());
        route.setEstimatedDuration(request.getEstimatedDuration());
        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Route not found");
        }
        routeRepository.deleteById(id);
    }

    // ==================== COACH MANAGEMENT ====================
    @Transactional(readOnly = true)
    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    @Transactional
    public Coach createCoach(CoachRequest request) {
        if (coachRepository.findByLicensePlate(request.getLicensePlate()).isPresent()) {
            throw new BadRequestException("License plate already exists");
        }
        Coach coach = Coach.builder()
                .licensePlate(request.getLicensePlate())
                .type(Coach.CoachType.valueOf(request.getType().toUpperCase()))
                .totalSeats(request.getTotalSeats())
                .description(request.getDescription())
                .build();
        return coachRepository.save(coach);
    }

    @Transactional
    public Coach updateCoach(Long id, CoachRequest request) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found"));
        coach.setLicensePlate(request.getLicensePlate());
        coach.setType(Coach.CoachType.valueOf(request.getType().toUpperCase()));
        coach.setTotalSeats(request.getTotalSeats());
        coach.setDescription(request.getDescription());
        return coachRepository.save(coach);
    }

    @Transactional
    public void deleteCoach(Long id) {
        if (!coachRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coach not found");
        }
        coachRepository.deleteById(id);
    }

    // ==================== TRIP MANAGEMENT ====================
    @Transactional(readOnly = true)
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Transactional
    public Trip createTrip(TripRequest request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found"));

        Trip trip = Trip.builder()
                .route(route)
                .coach(coach)
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .price(request.getPrice())
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        trip = tripRepository.save(trip);

        // Create seats for this trip
        createSeatsForTrip(trip, coach.getTotalSeats());
        return trip;
    }

    @Transactional
    public Trip updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found"));
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new ResourceNotFoundException("Coach not found"));

        trip.setRoute(route);
        trip.setCoach(coach);
        trip.setDepartureTime(request.getDepartureTime());
        trip.setArrivalTime(request.getArrivalTime());
        trip.setPrice(request.getPrice());
        return tripRepository.save(trip);
    }

    @Transactional
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trip not found");
        }
        tripRepository.deleteById(id);
    }

    @Transactional
    public Trip updateTripStatus(Long id, String status) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        trip.setStatus(Trip.TripStatus.valueOf(status.toUpperCase()));
        return tripRepository.save(trip);
    }

    private void createSeatsForTrip(Trip trip, int totalSeats) {
        List<Seat> seats = new ArrayList<>();
        
        // Xe giường nằm 41 giường: Tầng 1 (A1-A18), Tầng 2 (B1-B23)
        // Tầng 1: 18 ghế
        for (int i = 1; i <= 18; i++) {
            seats.add(Seat.builder()
                    .trip(trip)
                    .seatNumber("A" + i)
                    .status(Seat.SeatStatus.AVAILABLE)
                    .build());
        }
        
        // Tầng 2: 23 ghế
        for (int i = 1; i <= 23; i++) {
            seats.add(Seat.builder()
                    .trip(trip)
                    .seatNumber("B" + i)
                    .status(Seat.SeatStatus.AVAILABLE)
                    .build());
        }
        
        seatRepository.saveAll(seats);
    }
}
