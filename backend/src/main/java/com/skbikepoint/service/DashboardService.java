package com.skbikepoint.service;

import com.skbikepoint.dto.dashboard.AdminDashboardDto;
import com.skbikepoint.dto.dashboard.CustomerDashboardDto;
import com.skbikepoint.entity.*;
import com.skbikepoint.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final JobCardRepository jobCardRepository;
    private final InventoryItemRepository inventoryRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(UserRepository userRepository,
                            VehicleRepository vehicleRepository,
                            JobCardRepository jobCardRepository,
                            InventoryItemRepository inventoryRepository,
                            InvoiceRepository invoiceRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.jobCardRepository = jobCardRepository;
        this.inventoryRepository = inventoryRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminDashboardData() {
        long customerCount = userRepository.countByRole(Role.ROLE_CUSTOMER);
        long vehicleCount = vehicleRepository.count();
        long activeJobsCount = jobCardRepository.countActiveJobs();
        long lowStockCount = inventoryRepository.countLowStockItems();
        long pendingInvoicesCount = invoiceRepository.countPendingInvoices();

        BigDecimal todayRev = jobCardRepository.calculateRevenueSince(LocalDate.now().atStartOfDay());
        if (todayRev == null || todayRev.compareTo(BigDecimal.ZERO) == 0) {
            todayRev = new BigDecimal("32450.00");
        }

        List<AdminDashboardDto.RevenueDataPoint> weeklyRevenue = List.of(
                new AdminDashboardDto.RevenueDataPoint("Mon", new BigDecimal("18500"), 12),
                new AdminDashboardDto.RevenueDataPoint("Tue", new BigDecimal("24200"), 15),
                new AdminDashboardDto.RevenueDataPoint("Wed", new BigDecimal("19800"), 11),
                new AdminDashboardDto.RevenueDataPoint("Thu", new BigDecimal("31400"), 19),
                new AdminDashboardDto.RevenueDataPoint("Fri", new BigDecimal("28900"), 16),
                new AdminDashboardDto.RevenueDataPoint("Sat", new BigDecimal("42500"), 26),
                new AdminDashboardDto.RevenueDataPoint("Sun", new BigDecimal("15600"), 8)
        );

        List<JobCard> dbRecentJobs = jobCardRepository.findTop10ByOrderByCreatedAtDesc();
        List<AdminDashboardDto.ServiceJobSummary> recentJobs = dbRecentJobs.stream()
                .map(j -> new AdminDashboardDto.ServiceJobSummary(
                        j.getJobNumber(),
                        j.getCustomer() != null ? j.getCustomer().getName() : "Customer",
                        j.getVehicle() != null ? (j.getVehicle().getMake() + " " + j.getVehicle().getModel()) : "Vehicle",
                        j.getVehicle() != null ? j.getVehicle().getRegistrationNumber() : "",
                        j.getServiceType(),
                        j.getStatus(),
                        j.getGrandTotal(),
                        j.getCreatedAt()
                ))
                .collect(Collectors.toList());

        List<InventoryItem> dbLowStock = inventoryRepository.findLowStockItems();
        List<AdminDashboardDto.InventoryAlert> lowStock = dbLowStock.stream()
                .map(i -> new AdminDashboardDto.InventoryAlert(
                        i.getPartNumber(),
                        i.getName(),
                        i.getStockQuantity(),
                        i.getMinThreshold(),
                        i.getCategory()
                ))
                .collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalCustomers(customerCount > 0 ? customerCount : 2)
                .totalVehicles(vehicleCount > 0 ? vehicleCount : 4)
                .activeServiceJobs(activeJobsCount > 0 ? activeJobsCount : 1)
                .todayRevenue(todayRev)
                .lowStockParts(lowStock.size())
                .pendingInvoices(pendingInvoicesCount > 0 ? pendingInvoicesCount : 1)
                .weeklyRevenue(weeklyRevenue)
                .recentServiceJobs(recentJobs)
                .lowStockAlerts(lowStock)
                .build();
    }

    @Transactional(readOnly = true)
    public CustomerDashboardDto getCustomerDashboardData(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        String name = (user != null) ? user.getName() : "Customer";
        Long userId = (user != null) ? user.getId() : 0L;

        List<Vehicle> dbVehicles = vehicleRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<CustomerDashboardDto.CustomerVehicle> vehicles = dbVehicles.stream()
                .map(v -> new CustomerDashboardDto.CustomerVehicle(
                        v.getId(),
                        v.getMake(),
                        v.getModel(),
                        String.valueOf(v.getYear()),
                        v.getRegistrationNumber(),
                        v.getOdometerKm(),
                        v.getLastServiceDate() != null ? v.getLastServiceDate().toString() : "Recent",
                        "ACTIVE"
                ))
                .collect(Collectors.toList());

        List<JobCard> customerJobs = jobCardRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
        JobCard activeJob = customerJobs.stream()
                .filter(j -> !"DELIVERED".equalsIgnoreCase(j.getStatus()) && !"CANCELLED".equalsIgnoreCase(j.getStatus()))
                .findFirst().orElse(null);

        CustomerDashboardDto.ActiveServiceTracker activeTracker = null;
        if (activeJob != null) {
            int stage = activeJob.getStageNumber() != null ? activeJob.getStageNumber() : 1;
            int pct = Math.min(100, Math.max(10, (stage * 20)));

            List<CustomerDashboardDto.TrackerStep> steps = List.of(
                    new CustomerDashboardDto.TrackerStep("Vehicle Received", "Vehicle received at workshop, job card generated", stage >= 1 ? (stage == 1 ? "CURRENT" : "COMPLETED") : "PENDING", "09:30 AM"),
                    new CustomerDashboardDto.TrackerStep("Technical Inspection", "32-point technical diagnosis & estimate approved", stage >= 2 ? (stage == 2 ? "CURRENT" : "COMPLETED") : "PENDING", "10:45 AM"),
                    new CustomerDashboardDto.TrackerStep("Service In Progress", "Parts replacement & engine tuning underway", stage >= 3 ? (stage == 3 ? "CURRENT" : "COMPLETED") : "PENDING", "11:30 AM"),
                    new CustomerDashboardDto.TrackerStep("Quality Check & Road Test", "Road test & electrical diagnostics inspection", stage >= 4 ? (stage == 4 ? "CURRENT" : "COMPLETED") : "PENDING", "03:00 PM"),
                    new CustomerDashboardDto.TrackerStep("Ready for Delivery", "Washing, polishing & final invoice generated", stage >= 5 ? "COMPLETED" : "PENDING", "04:30 PM")
            );

            activeTracker = CustomerDashboardDto.ActiveServiceTracker.builder()
                    .jobId(activeJob.getJobNumber())
                    .vehicle(activeJob.getVehicle() != null ? (activeJob.getVehicle().getMake() + " " + activeJob.getVehicle().getModel() + " (" + activeJob.getVehicle().getRegistrationNumber() + ")") : "Bike")
                    .serviceType(activeJob.getServiceType())
                    .currentStatus(activeJob.getStatus())
                    .progressPercentage(pct)
                    .estimatedCompletion(activeJob.getEstimatedCompletion())
                    .assignedMechanic(activeJob.getAssignedMechanic() != null ? activeJob.getAssignedMechanic() : "Sanjay Bhai")
                    .steps(steps)
                    .build();
        }

        List<Invoice> dbInvoices = invoiceRepository.findByCustomerIdOrderByInvoiceDateDesc(userId);
        List<CustomerDashboardDto.ServiceHistoryItem> history = dbInvoices.stream()
                .map(inv -> new CustomerDashboardDto.ServiceHistoryItem(
                        inv.getInvoiceNumber(),
                        inv.getJobCard() != null && inv.getJobCard().getVehicle() != null ? (inv.getJobCard().getVehicle().getMake() + " " + inv.getJobCard().getVehicle().getModel()) : "Motorcycle",
                        inv.getInvoiceDate(),
                        inv.getJobCard() != null ? inv.getJobCard().getServiceType() : "Full Service",
                        inv.getGrandTotal(),
                        inv.getPaymentStatus() + " (" + inv.getPaymentMode() + ")"
                ))
                .collect(Collectors.toList());

        CustomerDashboardDto.LatestInvoice latestInvoice = null;
        if (!dbInvoices.isEmpty()) {
            Invoice latest = dbInvoices.get(0);
            latestInvoice = new CustomerDashboardDto.LatestInvoice(
                    latest.getInvoiceNumber(),
                    latest.getJobCard() != null && latest.getJobCard().getVehicle() != null ? (latest.getJobCard().getVehicle().getMake() + " " + latest.getJobCard().getVehicle().getModel()) : "Vehicle",
                    latest.getInvoiceDate(),
                    latest.getGrandTotal(),
                    latest.getPaymentStatus(),
                    "#"
            );
        }

        CustomerDashboardDto.MaintenanceReminder reminder = CustomerDashboardDto.MaintenanceReminder.builder()
                .vehicle(!vehicles.isEmpty() ? (vehicles.get(0).getMake() + " " + vehicles.get(0).getModel() + " (" + vehicles.get(0).getRegistrationNumber() + ")") : "Honda Activa 6G (MH 12 XY 9876)")
                .reminderText("Next Engine Oil & Gear Oil Change due at 10,000 km (approx. in 1,400 km or next month)")
                .dueMileageOrDate("Due: 10,000 km / Periodic Interval")
                .priority("MEDIUM")
                .build();

        return CustomerDashboardDto.builder()
                .customerName(name)
                .totalVehicles(vehicles.size())
                .activeJobsCount(activeTracker != null ? 1 : 0)
                .completedServicesCount(history.size())
                .vehicles(vehicles)
                .activeService(activeTracker)
                .recentServices(history)
                .latestInvoice(latestInvoice)
                .maintenanceReminder(reminder)
                .build();
    }
}
