package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.appointment.AppointmentDto;
import com.skbikepoint.dto.appointment.AppointmentRequest;
import com.skbikepoint.security.UserPrincipal;
import com.skbikepoint.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Public appointment booking
    @PostMapping("/public")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointmentPublic(@Valid @RequestBody AppointmentRequest request) {
        AppointmentDto booked = appointmentService.createAppointment(null, request);
        return ResponseEntity.ok(ApiResponse.success(booked, "Service appointment booked successfully"));
    }

    // Authenticated appointment booking
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(@AuthenticationPrincipal UserPrincipal principal,
                                                                       @Valid @RequestBody AppointmentRequest request) {
        AppointmentDto booked = appointmentService.createAppointment(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(booked, "Service appointment booked successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getAllAppointments(), "All appointments retrieved"));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getAppointmentsByCustomerId(principal.getId()), "Your appointments"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.updateStatus(id, status), "Appointment status updated"));
    }
}
