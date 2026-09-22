package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "S K Bike Point API");
        health.put("version", "1.0.0");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("database", "CONNECTED");
        health.put("environment", "DEVELOPMENT");

        return ResponseEntity.ok(ApiResponse.success(health, "Service is healthy and running"));
    }
}
