package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.trip.TripResponse;
import com.example.demo.dto.trip.TripSearchRequest;
import com.example.demo.entity.Coach;
import com.example.demo.entity.Trip;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.TripRepository;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;

    public TripService(TripRepository tripRepository, SeatRepository seatRepository) {
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional(readOnly = true)
    public List<TripResponse> searchTrips(TripSearchRequest request) {
        LocalDateTime startOfDay = request.getDepartureDate().atStartOfDay();
        LocalDateTime endOfDay = request.getDepartureDate().atTime(LocalTime.MAX);

        List<Trip> trips;
        if (request.getCoachType() != null && !request.getCoachType().isEmpty()) {
            Coach.CoachType coachType = Coach.CoachType.valueOf(request.getCoachType().toUpperCase());
            trips = tripRepository.searchTripsByCoachType(
                    request.getDeparture(), request.getDestination(), startOfDay, endOfDay, coachType);
        } else {
            trips = tripRepository.searchTrips(
                    request.getDeparture(), request.getDestination(), startOfDay, endOfDay);
        }

        Stream<Trip> tripStream = trips.stream();

        // Filter by time of day
        if (request.getTimeOfDay() != null && !request.getTimeOfDay().isEmpty()) {
            tripStream = tripStream.filter(trip -> matchesTimeOfDay(trip, request.getTimeOfDay()));
        }

        // Filter by price range
        if (request.getMinPrice() != null) {
            tripStream = tripStream.filter(trip -> trip.getPrice().compareTo(request.getMinPrice()) >= 0);
        }
        if (request.getMaxPrice() != null) {
            tripStream = tripStream.filter(trip -> trip.getPrice().compareTo(request.getMaxPrice()) <= 0);
        }

        List<TripResponse> results = tripStream.map(this::toTripResponse).collect(Collectors.toList());

        // Sort results
        if (request.getSortBy() != null) {
            switch (request.getSortBy().toUpperCase()) {
                case "PRICE_ASC":
                    results.sort(Comparator.comparing(TripResponse::getPrice));
                    break;
                case "PRICE_DESC":
                    results.sort(Comparator.comparing(TripResponse::getPrice).reversed());
                    break;
                case "TIME_ASC":
                    results.sort(Comparator.comparing(TripResponse::getDepartureTime));
                    break;
            }
        }

        return results;
    }

    private boolean matchesTimeOfDay(Trip trip, String timeOfDay) {
        int hour = trip.getDepartureTime().getHour();
        switch (timeOfDay.toUpperCase()) {
            case "MORNING":   return hour >= 5 && hour < 12;
            case "AFTERNOON": return hour >= 12 && hour < 18;
            case "EVENING":   return hour >= 18 || hour < 5;
            default: return true;
        }
    }

    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        return toTripResponse(trip);
    }

    private TripResponse toTripResponse(Trip trip) {
        int availableSeats = seatRepository.countAvailableSeats(trip.getId());
        return TripResponse.builder()
                .id(trip.getId())
                .departure(trip.getRoute().getDeparture())
                .destination(trip.getRoute().getDestination())
                .departureTime(trip.getDepartureTime())
                .arrivalTime(trip.getArrivalTime())
                .price(trip.getPrice())
                .coachType(trip.getCoach().getType().name())
                .licensePlate(trip.getCoach().getLicensePlate())
                .totalSeats(trip.getCoach().getTotalSeats())
                .availableSeats(availableSeats)
                .status(trip.getStatus().name())
                .build();
    }
}
