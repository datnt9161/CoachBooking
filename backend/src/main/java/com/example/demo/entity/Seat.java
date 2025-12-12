package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"trip_id", "seat_number"})
})
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status = SeatStatus.AVAILABLE;

    @Version
    private Long version;

    public Seat() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) { this.status = status; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public enum SeatStatus { AVAILABLE, SELECTED, BOOKED }

    public static SeatBuilder builder() { return new SeatBuilder(); }

    public static class SeatBuilder {
        private Trip trip;
        private String seatNumber;
        private SeatStatus status = SeatStatus.AVAILABLE;

        public SeatBuilder trip(Trip trip) { this.trip = trip; return this; }
        public SeatBuilder seatNumber(String seatNumber) { this.seatNumber = seatNumber; return this; }
        public SeatBuilder status(SeatStatus status) { this.status = status; return this; }

        public Seat build() {
            Seat seat = new Seat();
            seat.trip = this.trip;
            seat.seatNumber = this.seatNumber;
            seat.status = this.status;
            return seat;
        }
    }
}
