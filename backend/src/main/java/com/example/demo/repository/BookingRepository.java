package com.example.demo.repository;

import com.example.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.trip t JOIN FETCH t.route JOIN FETCH t.coach " +
           "JOIN FETCH b.seats WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);
    
    Optional<Booking> findByBookingCode(String bookingCode);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.trip t JOIN FETCH t.route JOIN FETCH t.coach " +
           "JOIN FETCH b.seats WHERE b.id = :id")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);
    
    List<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status);
}
