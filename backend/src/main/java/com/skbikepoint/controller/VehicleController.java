package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.vehicle.VehicleDto;
import com.skbikepoint.dto.vehicle.VehicleRequest;
import com.skbikepoint.security.UserPrincipal;
import com.skbikepoint.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getAllVehicles() {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getAllVehicles(), "All vehicles fetched"));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getMyVehicles(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehiclesByUserId(principal.getId()), "Your vehicles fetched"));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VehicleDto>> addVehicle(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody VehicleRequest request) {
        VehicleDto created = vehicleService.createVehicle(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(created, "Vehicle added to garage successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle removed successfully", "Vehicle removed successfully"));
    }
}
