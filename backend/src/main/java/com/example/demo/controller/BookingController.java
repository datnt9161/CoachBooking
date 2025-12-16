package com.example.demo.controller;

import com.example.demo.dto.booking.*;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(user.getId(), request));
    }

    @PostMapping("/payment")
    public ResponseEntity<BookingResponse> processPayment(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(bookingService.processPayment(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(user.getId(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(user.getId(), id));
    }

    @GetMapping("/{id}/payment-qr")
    public ResponseEntity<com.example.demo.dto.booking.PaymentQRResponse> getPaymentQR(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id,
            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(bookingService.getPaymentQR(user.getId(), id, paymentMethod));
    }
}
