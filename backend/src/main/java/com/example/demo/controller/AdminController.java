package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.admin.CoachRequest;
import com.example.demo.dto.admin.RouteRequest;
import com.example.demo.dto.admin.TripRequest;
import com.example.demo.entity.Coach;
import com.example.demo.entity.Route;
import com.example.demo.entity.Trip;
import com.example.demo.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================== ROUTE MANAGEMENT ====================
    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(adminService.getAllRoutes());
    }

    @PostMapping("/routes")
    public ResponseEntity<Route> createRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(adminService.createRoute(request));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(adminService.updateRoute(id, request));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Map<String, String>> deleteRoute(@PathVariable Long id) {
        adminService.deleteRoute(id);
        return ResponseEntity.ok(Map.of("message", "Route deleted successfully"));
    }

    // ==================== COACH MANAGEMENT ====================
    @GetMapping("/coaches")
    public ResponseEntity<List<Coach>> getAllCoaches() {
        return ResponseEntity.ok(adminService.getAllCoaches());
    }

    @PostMapping("/coaches")
    public ResponseEntity<Coach> createCoach(@Valid @RequestBody CoachRequest request) {
        return ResponseEntity.ok(adminService.createCoach(request));
    }

    @PutMapping("/coaches/{id}")
    public ResponseEntity<Coach> updateCoach(@PathVariable Long id, @Valid @RequestBody CoachRequest request) {
        return ResponseEntity.ok(adminService.updateCoach(id, request));
    }

    @DeleteMapping("/coaches/{id}")
    public ResponseEntity<Map<String, String>> deleteCoach(@PathVariable Long id) {
        adminService.deleteCoach(id);
        return ResponseEntity.ok(Map.of("message", "Coach deleted successfully"));
    }

    // ==================== TRIP MANAGEMENT ====================
    @GetMapping("/trips")
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(adminService.getAllTrips());
    }

    @PostMapping("/trips")
    public ResponseEntity<Trip> createTrip(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(adminService.createTrip(request));
    }

    @PutMapping("/trips/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(adminService.updateTrip(id, request));
    }

    @PatchMapping("/trips/{id}/status")
    public ResponseEntity<Trip> updateTripStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.updateTripStatus(id, body.get("status")));
    }

    @DeleteMapping("/trips/{id}")
    public ResponseEntity<Map<String, String>> deleteTrip(@PathVariable Long id) {
        adminService.deleteTrip(id);
        return ResponseEntity.ok(Map.of("message", "Trip deleted successfully"));
    }
}
