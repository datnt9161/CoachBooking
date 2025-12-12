package com.example.demo.dto.trip;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TripResponse {
    private Long id;
    private String departure;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;
    private String coachType;
    private String licensePlate;
    private Integer totalSeats;
    private Integer availableSeats;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCoachType() { return coachType; }
    public void setCoachType(String coachType) { this.coachType = coachType; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static TripResponseBuilder builder() { return new TripResponseBuilder(); }

    public static class TripResponseBuilder {
        private Long id;
        private String departure;
        private String destination;
        private LocalDateTime departureTime;
        private LocalDateTime arrivalTime;
        private BigDecimal price;
        private String coachType;
        private String licensePlate;
        private Integer totalSeats;
        private Integer availableSeats;
        private String status;

        public TripResponseBuilder id(Long id) { this.id = id; return this; }
        public TripResponseBuilder departure(String departure) { this.departure = departure; return this; }
        public TripResponseBuilder destination(String destination) { this.destination = destination; return this; }
        public TripResponseBuilder departureTime(LocalDateTime departureTime) { this.departureTime = departureTime; return this; }
        public TripResponseBuilder arrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; return this; }
        public TripResponseBuilder price(BigDecimal price) { this.price = price; return this; }
        public TripResponseBuilder coachType(String coachType) { this.coachType = coachType; return this; }
        public TripResponseBuilder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }
        public TripResponseBuilder totalSeats(Integer totalSeats) { this.totalSeats = totalSeats; return this; }
        public TripResponseBuilder availableSeats(Integer availableSeats) { this.availableSeats = availableSeats; return this; }
        public TripResponseBuilder status(String status) { this.status = status; return this; }

        public TripResponse build() {
            TripResponse r = new TripResponse();
            r.id = this.id; r.departure = this.departure; r.destination = this.destination;
            r.departureTime = this.departureTime; r.arrivalTime = this.arrivalTime;
            r.price = this.price; r.coachType = this.coachType; r.licensePlate = this.licensePlate;
            r.totalSeats = this.totalSeats; r.availableSeats = this.availableSeats; r.status = this.status;
            return r;
        }
    }
}
