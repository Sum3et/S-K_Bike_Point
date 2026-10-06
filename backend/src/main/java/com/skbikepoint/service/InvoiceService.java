package com.skbikepoint.service;

import com.skbikepoint.dto.invoice.InvoiceDto;
import com.skbikepoint.entity.Invoice;
import com.skbikepoint.entity.JobCard;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.InvoiceRepository;
import com.skbikepoint.repository.JobCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final JobCardRepository jobCardRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, JobCardRepository jobCardRepository) {
        this.invoiceRepository = invoiceRepository;
        this.jobCardRepository = jobCardRepository;
    }

    @Transactional(readOnly = true)
    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepository.findTop10ByOrderByInvoiceDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InvoiceDto> getInvoicesByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerIdOrderByInvoiceDateDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvoiceDto getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return mapToDto(invoice);
    }

    @Transactional
    public InvoiceDto generateInvoiceForJob(Long jobId, String paymentMode, String paymentStatus) {
        JobCard job = jobCardRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard", "id", jobId));

        long count = invoiceRepository.count() + 1;
        String invoiceNumber = String.format("INV-2026-%03d", count);

        BigDecimal labor = job.getLaborCharges() != null ? job.getLaborCharges() : BigDecimal.ZERO;
        BigDecimal parts = job.getPartsTotal() != null ? job.getPartsTotal() : BigDecimal.ZERO;
        BigDecimal subtotal = labor.add(parts);
        BigDecimal gstRate = new BigDecimal("18.00");
        BigDecimal gstAmount = subtotal.multiply(new BigDecimal("0.18"));
        BigDecimal grandTotal = subtotal.add(gstAmount);

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .jobCard(job)
                .customer(job.getCustomer())
                .laborAmount(labor)
                .partsAmount(parts)
                .subtotal(subtotal)
                .gstRate(gstRate)
                .gstAmount(gstAmount)
                .grandTotal(grandTotal)
                .paymentStatus(paymentStatus != null ? paymentStatus : "PAID")
                .paymentMode(paymentMode != null ? paymentMode : "UPI")
                .invoiceDate(LocalDate.now())
                .build();

        return mapToDto(invoiceRepository.save(invoice));
    }

    public InvoiceDto mapToDto(Invoice inv) {
        return InvoiceDto.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .jobCardId(inv.getJobCard() != null ? inv.getJobCard().getId() : null)
                .jobNumber(inv.getJobCard() != null ? inv.getJobCard().getJobNumber() : "")
                .vehicleRegistration(inv.getJobCard() != null && inv.getJobCard().getVehicle() != null ? inv.getJobCard().getVehicle().getRegistrationNumber() : "")
                .vehicleModel(inv.getJobCard() != null && inv.getJobCard().getVehicle() != null ? (inv.getJobCard().getVehicle().getMake() + " " + inv.getJobCard().getVehicle().getModel()) : "")
                .customerId(inv.getCustomer() != null ? inv.getCustomer().getId() : null)
                .customerName(inv.getCustomer() != null ? inv.getCustomer().getName() : "")
                .customerPhone(inv.getCustomer() != null ? inv.getCustomer().getPhone() : "")
                .laborAmount(inv.getLaborAmount())
                .partsAmount(inv.getPartsAmount())
                .subtotal(inv.getSubtotal())
                .gstRate(inv.getGstRate())
                .gstAmount(inv.getGstAmount())
                .grandTotal(inv.getGrandTotal())
                .paymentStatus(inv.getPaymentStatus())
                .paymentMode(inv.getPaymentMode())
                .invoiceDate(inv.getInvoiceDate())
                .build();
    }
}
