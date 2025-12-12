package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String departure;

    @Column(nullable = false)
    private String destination;

    private Double distance;
    private Integer estimatedDuration;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Trip> trips;

    public Route() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
    public List<Trip> getTrips() { return trips; }
    public void setTrips(List<Trip> trips) { this.trips = trips; }

    public static RouteBuilder builder() { return new RouteBuilder(); }

    public static class RouteBuilder {
        private String departure;
        private String destination;
        private Double distance;
        private Integer estimatedDuration;

        public RouteBuilder departure(String departure) { this.departure = departure; return this; }
        public RouteBuilder destination(String destination) { this.destination = destination; return this; }
        public RouteBuilder distance(Double distance) { this.distance = distance; return this; }
        public RouteBuilder estimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }

        public Route build() {
            Route route = new Route();
            route.departure = this.departure;
            route.destination = this.destination;
            route.distance = this.distance;
            route.estimatedDuration = this.estimatedDuration;
            return route;
        }
    }
}
