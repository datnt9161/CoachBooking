package com.example.demo.controller;

import com.example.demo.dto.seat.SeatResponse;
import com.example.demo.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(seatService.getSeatsByTrip(tripId));
    }

    @GetMapping("/trip/{tripId}/available")
    public ResponseEntity<List<SeatResponse>> getAvailableSeats(@PathVariable Long tripId) {
        return ResponseEntity.ok(seatService.getAvailableSeats(tripId));
    }
}
