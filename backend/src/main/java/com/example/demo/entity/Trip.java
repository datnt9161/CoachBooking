package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.SCHEDULED;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Seat> seats;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public Trip() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    public Coach getCoach() { return coach; }
    public void setCoach(Coach coach) { this.coach = coach; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    public enum TripStatus { SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED }

    public static TripBuilder builder() { return new TripBuilder(); }

    public static class TripBuilder {
        private Route route;
        private Coach coach;
        private LocalDateTime departureTime;
        private LocalDateTime arrivalTime;
        private BigDecimal price;
        private TripStatus status = TripStatus.SCHEDULED;

        public TripBuilder route(Route route) { this.route = route; return this; }
        public TripBuilder coach(Coach coach) { this.coach = coach; return this; }
        public TripBuilder departureTime(LocalDateTime departureTime) { this.departureTime = departureTime; return this; }
        public TripBuilder arrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; return this; }
        public TripBuilder price(BigDecimal price) { this.price = price; return this; }
        public TripBuilder status(TripStatus status) { this.status = status; return this; }

        public Trip build() {
            Trip trip = new Trip();
            trip.route = this.route;
            trip.coach = this.coach;
            trip.departureTime = this.departureTime;
            trip.arrivalTime = this.arrivalTime;
            trip.price = this.price;
            trip.status = this.status;
            return trip;
        }
    }
}
