package com.skbikepoint.service;

import com.skbikepoint.dto.dashboard.AdminDashboardDto;
import com.skbikepoint.dto.dashboard.CustomerDashboardDto;
import com.skbikepoint.entity.Role;
import com.skbikepoint.entity.User;
import com.skbikepoint.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AdminDashboardDto getAdminDashboardData() {
        long customerCount = userRepository.countByRole(Role.ROLE_CUSTOMER);
        if (customerCount < 1) customerCount = 128;

        List<AdminDashboardDto.RevenueDataPoint> weeklyRevenue = List.of(
                new AdminDashboardDto.RevenueDataPoint("Mon", new BigDecimal("18500"), 12),
                new AdminDashboardDto.RevenueDataPoint("Tue", new BigDecimal("24200"), 15),
                new AdminDashboardDto.RevenueDataPoint("Wed", new BigDecimal("19800"), 11),
                new AdminDashboardDto.RevenueDataPoint("Thu", new BigDecimal("31400"), 19),
                new AdminDashboardDto.RevenueDataPoint("Fri", new BigDecimal("28900"), 16),
                new AdminDashboardDto.RevenueDataPoint("Sat", new BigDecimal("42500"), 26),
                new AdminDashboardDto.RevenueDataPoint("Sun", new BigDecimal("15600"), 8)
        );

        List<AdminDashboardDto.ServiceJobSummary> recentJobs = List.of(
                new AdminDashboardDto.ServiceJobSummary("JOB-2026-081", "Rahul Sharma", "Royal Enfield Classic 350", "MH 12 AB 1234", "Full General Service & Engine Tune-up", "IN_PROGRESS", new BigDecimal("3450.00"), LocalDateTime.now().minusHours(2)),
                new AdminDashboardDto.ServiceJobSummary("JOB-2026-080", "Pooja Patel", "Honda Activa 6G", "MH 14 CD 5678", "Brake Pad Replacement & Oil Change", "READY", new BigDecimal("1250.00"), LocalDateTime.now().minusHours(4)),
                new AdminDashboardDto.ServiceJobSummary("JOB-2026-079", "Amit Verma", "Yamaha MT-15 V2", "MH 12 EF 9012", "Chain Sprocket & Clutch Overhaul", "INSPECTION", new BigDecimal("4800.00"), LocalDateTime.now().minusHours(6)),
                new AdminDashboardDto.ServiceJobSummary("JOB-2026-078", "Suresh Rao", "Bajaj Pulsar NS200", "MH 12 GH 3456", "Periodic Maintenance (15,000 km)", "DELIVERED", new BigDecimal("2100.00"), LocalDateTime.now().minusDays(1)),
                new AdminDashboardDto.ServiceJobSummary("JOB-2026-077", "Vikram Singh", "KTM Duke 390", "MH 14 JK 7890", "Coolant Flush & Electrical Diagnosis", "RECEIVED", new BigDecimal("2900.00"), LocalDateTime.now().minusHours(1))
        );

        List<AdminDashboardDto.InventoryAlert> lowStock = List.of(
                new AdminDashboardDto.InventoryAlert("MOT-5100-15W50", "Motul 5100 4T 15W50 Synthetic Oil (1L)", 4, 15, "Engine Oil"),
                new AdminDashboardDto.InventoryAlert("BRK-PAD-RE350", "Bosch Front Disc Brake Pads (Classic 350)", 2, 8, "Brakes"),
                new AdminDashboardDto.InventoryAlert("SPK-NGK-CPR8", "NGK Laser Iridium Spark Plug CPR8EAIX-9", 3, 10, "Ignition"),
                new AdminDashboardDto.InventoryAlert("FLT-AIR-ACT6G", "Original OEM Air Filter (Activa 6G)", 5, 12, "Filters")
        );

        return AdminDashboardDto.builder()
                .totalCustomers(customerCount)
                .totalVehicles(184)
                .activeServiceJobs(14)
                .todayRevenue(new BigDecimal("32450.00"))
                .lowStockParts(lowStock.size())
                .pendingInvoices(8)
                .weeklyRevenue(weeklyRevenue)
                .recentServiceJobs(recentJobs)
                .lowStockAlerts(lowStock)
                .build();
    }

    public CustomerDashboardDto getCustomerDashboardData(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        String name = (user != null) ? user.getName() : "Customer";

        List<CustomerDashboardDto.CustomerVehicle> vehicles = List.of(
                new CustomerDashboardDto.CustomerVehicle(101L, "Royal Enfield", "Classic 350 Gunmetal Grey", "2023", "MH 12 AB 1234", 14250, "2026-06-15", "IN_SERVICE"),
                new CustomerDashboardDto.CustomerVehicle(102L, "Honda", "Activa 6G Premium Edition", "2022", "MH 12 XY 9876", 8600, "2026-04-10", "ACTIVE")
        );

        List<CustomerDashboardDto.TrackerStep> steps = List.of(
                new CustomerDashboardDto.TrackerStep("Vehicle Received", "Vehicle received at workshop, job card generated", "COMPLETED", "Today 09:30 AM"),
                new CustomerDashboardDto.TrackerStep("Technical Inspection", "32-point technical diagnosis & estimate approved", "COMPLETED", "Today 10:45 AM"),
                new CustomerDashboardDto.TrackerStep("Service In Progress", "Engine oil flush, tappet adjustment & brake cleaning underway", "CURRENT", "Today 11:30 AM"),
                new CustomerDashboardDto.TrackerStep("Quality Check & Road Test", "Road test & electrical diagnostics inspection", "PENDING", "Est. 03:00 PM"),
                new CustomerDashboardDto.TrackerStep("Ready for Delivery", "Washing, polishing & final invoice generated", "PENDING", "Est. 04:30 PM")
        );

        CustomerDashboardDto.ActiveServiceTracker activeTracker = CustomerDashboardDto.ActiveServiceTracker.builder()
                .jobId("JOB-2026-081")
                .vehicle("Royal Enfield Classic 350 (MH 12 AB 1234)")
                .serviceType("Full General Service & Engine Tune-up")
                .currentStatus("IN_PROGRESS")
                .progressPercentage(60)
                .estimatedCompletion("Today by 05:00 PM")
                .assignedMechanic("Sunil Gaikwad (Master Mechanic)")
                .steps(steps)
                .build();

        List<CustomerDashboardDto.ServiceHistoryItem> history = List.of(
                new CustomerDashboardDto.ServiceHistoryItem("INV-2026-0442", "Royal Enfield Classic 350", LocalDate.of(2026, 6, 15), "10,000 km Periodic Service + Synthetic Oil", new BigDecimal("2850.00"), "PAID (UPI)"),
                new CustomerDashboardDto.ServiceHistoryItem("INV-2026-0289", "Honda Activa 6G", LocalDate.of(2026, 4, 10), "Carburetor Cleaning & Front Brake Shoes", new BigDecimal("1150.00"), "PAID (Cash)"),
                new CustomerDashboardDto.ServiceHistoryItem("INV-2026-0112", "Royal Enfield Classic 350", LocalDate.of(2026, 1, 18), "Battery Replacement & Chain Lubrication", new BigDecimal("2400.00"), "PAID (Card)")
        );

        CustomerDashboardDto.LatestInvoice latestInvoice = new CustomerDashboardDto.LatestInvoice(
                "INV-2026-0442", "Royal Enfield Classic 350 (MH 12 AB 1234)", LocalDate.of(2026, 6, 15), new BigDecimal("2850.00"), "PAID", "#"
        );

        CustomerDashboardDto.MaintenanceReminder reminder = new CustomerDashboardDto.MaintenanceReminder(
                "Honda Activa 6G (MH 12 XY 9876)", "Next Engine Oil & Gear Oil Change due at 10,000 km (approx. in 1,400 km or by Sept 2026)", "Due: 10,000 km / 15-Sep-2026", "MEDIUM"
        );

        return CustomerDashboardDto.builder()
                .customerName(name)
                .totalVehicles(vehicles.size())
                .activeJobsCount(1)
                .completedServicesCount(6)
                .vehicles(vehicles)
                .activeService(activeTracker)
                .recentServices(history)
                .latestInvoice(latestInvoice)
                .maintenanceReminder(reminder)
                .build();
    }
}
