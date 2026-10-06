package com.skbikepoint.controller;

import com.skbikepoint.dto.ApiResponse;
import com.skbikepoint.dto.invoice.InvoiceDto;
import com.skbikepoint.security.UserPrincipal;
import com.skbikepoint.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> getAllInvoices() {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getAllInvoices(), "All invoices retrieved"));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> getMyInvoices(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoicesByCustomerId(principal.getId()), "Your invoices retrieved"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoiceById(id), "Invoice details"));
    }

    @PostMapping("/generate/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InvoiceDto>> generateInvoice(@PathVariable Long jobId,
                                                                   @RequestParam(defaultValue = "UPI") String paymentMode,
                                                                   @RequestParam(defaultValue = "PAID") String paymentStatus) {
        return ResponseEntity.ok(ApiResponse.success(invoiceService.generateInvoiceForJob(jobId, paymentMode, paymentStatus), "Invoice generated successfully"));
    }
}
