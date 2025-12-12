package com.example.demo.dto.admin;

import jakarta.validation.constraints.NotBlank;

public class RouteRequest {
    @NotBlank(message = "Departure is required")
    private String departure;

    @NotBlank(message = "Destination is required")
    private String destination;

    private Double distance;
    private Integer estimatedDuration; // minutes

    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
}
