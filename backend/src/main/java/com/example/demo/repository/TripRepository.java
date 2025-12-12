package com.example.demo.repository;

import com.example.demo.entity.Coach;
import com.example.demo.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    @Query("SELECT t FROM Trip t JOIN FETCH t.route r JOIN FETCH t.coach c " +
           "WHERE r.departure = :departure AND r.destination = :destination " +
           "AND t.departureTime >= :startDate AND t.departureTime < :endDate " +
           "AND t.status = 'SCHEDULED' ORDER BY t.departureTime")
    List<Trip> searchTrips(@Param("departure") String departure,
                           @Param("destination") String destination,
                           @Param("startDate") LocalDateTime startDate,
                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t FROM Trip t JOIN FETCH t.route r JOIN FETCH t.coach c " +
           "WHERE r.departure = :departure AND r.destination = :destination " +
           "AND t.departureTime >= :startDate AND t.departureTime < :endDate " +
           "AND c.type = :coachType AND t.status = 'SCHEDULED' ORDER BY t.departureTime")
    List<Trip> searchTripsByCoachType(@Param("departure") String departure,
                                       @Param("destination") String destination,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate,
                                       @Param("coachType") Coach.CoachType coachType);

    List<Trip> findByRouteIdAndDepartureTimeBetween(Long routeId, LocalDateTime start, LocalDateTime end);
}
