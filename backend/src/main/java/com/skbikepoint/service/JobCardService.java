package com.skbikepoint.service;

import com.skbikepoint.dto.job.JobCardDto;
import com.skbikepoint.dto.job.JobCardRequest;
import com.skbikepoint.entity.*;
import com.skbikepoint.exception.BadRequestException;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobCardService {

    private final JobCardRepository jobCardRepository;
    private final JobCardPartRepository jobCardPartRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final InventoryItemRepository inventoryRepository;

    public JobCardService(JobCardRepository jobCardRepository,
                          JobCardPartRepository jobCardPartRepository,
                          VehicleRepository vehicleRepository,
                          UserRepository userRepository,
                          InventoryItemRepository inventoryRepository) {
        this.jobCardRepository = jobCardRepository;
        this.jobCardPartRepository = jobCardPartRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<JobCardDto> getAllJobs() {
        return jobCardRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobCardDto> getJobsByCustomerId(Long customerId) {
        return jobCardRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobCardDto getJobById(Long id) {
        JobCard job = jobCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard", "id", id));
        return mapToDto(job);
    }

    @Transactional(readOnly = true)
    public JobCardDto trackJob(String query) {
        String clean = query.trim();
        List<JobCard> jobs = jobCardRepository.findByJobNumberOrVehicleRegistration(clean);
        if (jobs.isEmpty()) {
            throw new ResourceNotFoundException("JobCard or Vehicle", "query", clean);
        }
        JobCard selected = jobs.stream()
                .filter(j -> !"DELIVERED".equalsIgnoreCase(j.getStatus()) && !"CANCELLED".equalsIgnoreCase(j.getStatus()))
                .findFirst()
                .orElse(jobs.get(0));
        return mapToDto(selected);
    }

    @Transactional
    public JobCardDto createJobCard(JobCardRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId()));

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getCustomerId()));

        long count = jobCardRepository.count() + 1;
        String jobNumber = String.format("JOB-2026-%03d", count);

        BigDecimal labor = request.getLaborCharges() != null ? request.getLaborCharges() : BigDecimal.ZERO;
        BigDecimal partsTotal = BigDecimal.ZERO;

        JobCard jobCard = JobCard.builder()
                .jobNumber(jobNumber)
                .vehicle(vehicle)
                .customer(customer)
                .serviceType(request.getServiceType())
                .status(request.getStatus() != null ? request.getStatus() : "RECEIVED")
                .stageNumber(request.getStageNumber() != null ? request.getStageNumber() : 1)
                .stageName(request.getStageName() != null ? request.getStageName() : "Vehicle Intake & Inspection")
                .assignedMechanic(request.getAssignedMechanic() != null ? request.getAssignedMechanic() : "Sanjay Bhai")
                .estimatedCompletion(request.getEstimatedCompletion() != null ? request.getEstimatedCompletion() : "Today, 6:00 PM")
                .diagnosticNotes(request.getDiagnosticNotes() != null ? request.getDiagnosticNotes() : "Vehicle received for inspection.")
                .laborCharges(labor)
                .partsTotal(BigDecimal.ZERO)
                .grandTotal(labor)
                .build();

        JobCard saved = jobCardRepository.save(jobCard);

        if (request.getParts() != null && !request.getParts().isEmpty()) {
            List<JobCardPart> partList = new ArrayList<>();
            for (JobCardRequest.JobCardPartItem p : request.getParts()) {
                BigDecimal unitPrice = p.getUnitPrice() != null ? p.getUnitPrice() : BigDecimal.ZERO;
                int qty = p.getQuantity() != null ? p.getQuantity() : 1;
                BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(qty));
                partsTotal = partsTotal.add(total);

                InventoryItem item = null;
                if (p.getPartId() != null) {
                    item = inventoryRepository.findById(p.getPartId()).orElse(null);
                    if (item != null) {
                        item.setStockQuantity(Math.max(0, item.getStockQuantity() - qty));
                        inventoryRepository.save(item);
                    }
                }

                JobCardPart part = JobCardPart.builder()
                        .jobCard(saved)
                        .inventoryItem(item)
                        .partName(p.getPartName())
                        .quantity(qty)
                        .unitPrice(unitPrice)
                        .totalPrice(total)
                        .build();

                partList.add(part);
            }
            jobCardPartRepository.saveAll(partList);
            saved.setPartsTotal(partsTotal);
            saved.setGrandTotal(labor.add(partsTotal));
            saved = jobCardRepository.save(saved);
        }

        return mapToDto(saved);
    }

    @Transactional
    public JobCardDto updateJobStatus(Long id, String status, Integer stageNumber, String stageName) {
        JobCard job = jobCardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard", "id", id));

        if (status != null) job.setStatus(status);
        if (stageNumber != null) job.setStageNumber(stageNumber);
        if (stageName != null) job.setStageName(stageName);

        if ("DELIVERED".equalsIgnoreCase(status)) {
            Vehicle vehicle = job.getVehicle();
            if (vehicle != null) {
                vehicle.setLastServiceDate(LocalDate.now());
                vehicleRepository.save(vehicle);
            }
        }

        return mapToDto(jobCardRepository.save(job));
    }

    public JobCardDto mapToDto(JobCard job) {
        List<JobCardDto.JobPartDto> parts = new ArrayList<>();
        if (job.getParts() != null) {
            parts = job.getParts().stream().map(p -> JobCardDto.JobPartDto.builder()
                    .id(p.getId())
                    .partId(p.getInventoryItem() != null ? p.getInventoryItem().getId() : null)
                    .partName(p.getPartName())
                    .quantity(p.getQuantity())
                    .unitPrice(p.getUnitPrice())
                    .totalPrice(p.getTotalPrice())
                    .build()).collect(Collectors.toList());
        }

        return JobCardDto.builder()
                .id(job.getId())
                .jobNumber(job.getJobNumber())
                .vehicleId(job.getVehicle() != null ? job.getVehicle().getId() : null)
                .vehicleRegistration(job.getVehicle() != null ? job.getVehicle().getRegistrationNumber() : "")
                .vehicleModel(job.getVehicle() != null ? (job.getVehicle().getMake() + " " + job.getVehicle().getModel()) : "")
                .customerId(job.getCustomer() != null ? job.getCustomer().getId() : null)
                .customerName(job.getCustomer() != null ? job.getCustomer().getName() : "")
                .customerPhone(job.getCustomer() != null ? job.getCustomer().getPhone() : "")
                .serviceType(job.getServiceType())
                .status(job.getStatus())
                .stageNumber(job.getStageNumber())
                .stageName(job.getStageName())
                .assignedMechanic(job.getAssignedMechanic())
                .estimatedCompletion(job.getEstimatedCompletion())
                .diagnosticNotes(job.getDiagnosticNotes())
                .laborCharges(job.getLaborCharges())
                .partsTotal(job.getPartsTotal())
                .grandTotal(job.getGrandTotal())
                .parts(parts)
                .createdAt(job.getCreatedAt())
                .build();
    }
}
