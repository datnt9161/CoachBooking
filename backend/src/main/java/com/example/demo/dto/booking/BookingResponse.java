package com.example.demo.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.dto.seat.SeatResponse;

public class BookingResponse {
    private Long id;
    private String bookingCode;
    private String departure;
    private String destination;
    private LocalDateTime departureTime;
    private String coachType;
    private String licensePlate;
    private List<SeatResponse> seats;
    private List<String> seatNumbers;
    private BigDecimal totalPrice;
    private String status;
    private String paymentMethod;
    private String passengerName;
    private String passengerPhone;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }
    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public String getCoachType() { return coachType; }
    public void setCoachType(String coachType) { this.coachType = coachType; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public List<SeatResponse> getSeats() { return seats; }
    public void setSeats(List<SeatResponse> seats) { this.seats = seats; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public List<String> getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }

    public static BookingResponseBuilder builder() { return new BookingResponseBuilder(); }

    public static class BookingResponseBuilder {
        private Long id;
        private String bookingCode;
        private String departure;
        private String destination;
        private LocalDateTime departureTime;
        private String coachType;
        private String licensePlate;
        private List<SeatResponse> seats;
        private List<String> seatNumbers;
        private BigDecimal totalPrice;
        private String status;
        private String paymentMethod;
        private String passengerName;
        private String passengerPhone;
        private LocalDateTime createdAt;
        private LocalDateTime paidAt;

        public BookingResponseBuilder id(Long id) { this.id = id; return this; }
        public BookingResponseBuilder bookingCode(String bookingCode) { this.bookingCode = bookingCode; return this; }
        public BookingResponseBuilder departure(String departure) { this.departure = departure; return this; }
        public BookingResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public BookingResponseBuilder departureTime(LocalDateTime departureTime) { this.departureTime = departureTime; return this; }
        public BookingResponseBuilder coachType(String coachType) { this.coachType = coachType; return this; }
        public BookingResponseBuilder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }
        public BookingResponseBuilder seats(List<SeatResponse> seats) { this.seats = seats; return this; }
        public BookingResponseBuilder seatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; return this; }
        public BookingResponseBuilder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public BookingResponseBuilder status(String status) { this.status = status; return this; }
        public BookingResponseBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public BookingResponseBuilder passengerName(String passengerName) { this.passengerName = passengerName; return this; }
        public BookingResponseBuilder passengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; return this; }
        public BookingResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BookingResponseBuilder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }

        public BookingResponse build() {
            BookingResponse r = new BookingResponse();
            r.id = this.id; r.bookingCode = this.bookingCode; r.departure = this.departure;
            r.destination = this.destination; r.departureTime = this.departureTime;
            r.coachType = this.coachType; r.licensePlate = this.licensePlate; r.seats = this.seats;
            r.seatNumbers = this.seatNumbers; r.totalPrice = this.totalPrice; r.status = this.status;
            r.paymentMethod = this.paymentMethod; r.passengerName = this.passengerName;
            r.passengerPhone = this.passengerPhone; r.createdAt = this.createdAt; r.paidAt = this.paidAt;
            return r;
        }
    }
}
