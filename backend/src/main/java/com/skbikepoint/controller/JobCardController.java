package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.job.JobCardDto;
import com.skbikepoint.dto.job.JobCardRequest;
import com.skbikepoint.security.UserPrincipal;
import com.skbikepoint.service.JobCardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JobCardController {

    private final JobCardService jobCardService;

    public JobCardController(JobCardService jobCardService) {
        this.jobCardService = jobCardService;
    }

    // Public tracking by number plate or job number (Zero Login)
    @GetMapping("/public/jobs/track/{query}")
    public ResponseEntity<ApiResponse<JobCardDto>> trackJobPublic(@PathVariable String query) {
        JobCardDto job = jobCardService.trackJob(query);
        return ResponseEntity.ok(ApiResponse.success(job, "Job details found"));
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<JobCardDto>>> getAllJobs() {
        return ResponseEntity.ok(ApiResponse.success(jobCardService.getAllJobs(), "All job cards fetched"));
    }

    @GetMapping("/jobs/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<JobCardDto>>> getMyJobs(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(jobCardService.getJobsByCustomerId(principal.getId()), "Your job cards fetched"));
    }

    @GetMapping("/jobs/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<JobCardDto>> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobCardService.getJobById(id), "Job card fetched"));
    }

    @PostMapping("/jobs")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobCardDto>> createJobCard(@Valid @RequestBody JobCardRequest request) {
        JobCardDto created = jobCardService.createJobCard(request);
        return ResponseEntity.ok(ApiResponse.success(created, "Job card created successfully"));
    }

    @PatchMapping("/jobs/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<JobCardDto>> updateJobStatus(@PathVariable Long id,
                                                                   @RequestParam(required = false) String status,
                                                                   @RequestParam(required = false) Integer stageNumber,
                                                                   @RequestParam(required = false) String stageName) {
        JobCardDto updated = jobCardService.updateJobStatus(id, status, stageNumber, stageName);
        return ResponseEntity.ok(ApiResponse.success(updated, "Job status updated"));
    }
}
