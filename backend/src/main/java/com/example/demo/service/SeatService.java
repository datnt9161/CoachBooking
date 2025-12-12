package com.example.demo.service;

import com.example.demo.dto.seat.SeatResponse;
import com.example.demo.entity.Seat;
import com.example.demo.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByTrip(Long tripId) {
        return seatRepository.findByTripId(tripId).stream()
                .map(this::toSeatResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getAvailableSeats(Long tripId) {
        return seatRepository.findByTripIdAndStatus(tripId, Seat.SeatStatus.AVAILABLE).stream()
                .map(this::toSeatResponse)
                .collect(Collectors.toList());
    }

    private SeatResponse toSeatResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .status(seat.getStatus().name())
                .build();
    }
}
