package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.auth.UserDto;
import com.skbikepoint.dto.dashboard.AdminDashboardDto;
import com.skbikepoint.service.DashboardService;
import com.skbikepoint.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public AdminController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboard() {
        AdminDashboardDto dashboardData = dashboardService.getAdminDashboardData();
        return ResponseEntity.ok(ApiResponse.success(dashboardData, "Admin dashboard data loaded"));
    }

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserDto>>> getCustomers() {
        List<UserDto> customers = userService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success(customers, "Customer list retrieved"));
    }
}
