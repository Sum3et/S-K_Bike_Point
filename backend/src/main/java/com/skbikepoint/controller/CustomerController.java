package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.auth.UserDto;
import com.skbikepoint.dto.dashboard.CustomerDashboardDto;
import com.skbikepoint.service.AuthService;
import com.skbikepoint.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
public class CustomerController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public CustomerController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CustomerDashboardDto>> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        CustomerDashboardDto dashboardData = dashboardService.getCustomerDashboardData(email);
        return ResponseEntity.ok(ApiResponse.success(dashboardData, "Customer dashboard data loaded"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        UserDto user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user, "Customer profile loaded"));
    }
}
