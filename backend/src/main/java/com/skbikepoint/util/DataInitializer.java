package com.skbikepoint.util;

import com.skbikepoint.entity.*;
import com.skbikepoint.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final InventoryItemRepository inventoryRepository;
    private final JobCardRepository jobCardRepository;
    private final JobCardPartRepository jobCardPartRepository;
    private final InvoiceRepository invoiceRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           InventoryItemRepository inventoryRepository,
                           JobCardRepository jobCardRepository,
                           JobCardPartRepository jobCardPartRepository,
                           InvoiceRepository invoiceRepository,
                           AppointmentRepository appointmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.inventoryRepository = inventoryRepository;
        this.jobCardRepository = jobCardRepository;
        this.jobCardPartRepository = jobCardPartRepository;
        this.invoiceRepository = invoiceRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        User admin = seedAdmin();
        User customer1 = seedCustomer1();
        User customer2 = seedCustomer2();
        seedInventory();
        seedVehiclesAndJobs(customer1, customer2);
        log.info("🏍️ All S K Bike Point Database tables and seed records initialized successfully!");
    }

    private User seedAdmin() {
        return userRepository.findByEmail("admin@skbikepoint.com").orElseGet(() -> {
            User admin = User.builder()
                    .name("Sanjay Kumar Yadav (Workshop Head)")
                    .email("admin@skbikepoint.com")
                    .phone("+91 98699 04097")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            log.info("✅ Demo Admin user seeded: admin@skbikepoint.com");
            return userRepository.save(admin);
        });
    }

    private User seedCustomer1() {
        return userRepository.findByEmail("customer@example.com").orElseGet(() -> {
            User customer = User.builder()
                    .name("Rahul Sharma")
                    .email("customer@example.com")
                    .phone("+91 98230 12345")
                    .password(passwordEncoder.encode("Customer@123"))
                    .role(Role.ROLE_CUSTOMER)
                    .active(true)
                    .build();
            log.info("✅ Demo Customer 1 seeded: customer@example.com");
            return userRepository.save(customer);
        });
    }

    private User seedCustomer2() {
        return userRepository.findByEmail("pooja.patel@example.com").orElseGet(() -> {
            User customer2 = User.builder()
                    .name("Pooja Patel")
                    .email("pooja.patel@example.com")
                    .phone("+91 97654 67890")
                    .password(passwordEncoder.encode("Customer@123"))
                    .role(Role.ROLE_CUSTOMER)
                    .active(true)
                    .build();
            log.info("✅ Demo Customer 2 seeded: pooja.patel@example.com");
            return userRepository.save(customer2);
        });
    }

    private void seedInventory() {
        if (inventoryRepository.count() > 0) return;

        List<InventoryItem> items = List.of(
                InventoryItem.builder().partNumber("MOT-5100-15W50").name("Motul 5100 4T 15W50 Semi-Synthetic Oil (1L)").category("Engine Oil").stockQuantity(4).minThreshold(15).unitPrice(new BigDecimal("550.00")).locationBin("Rack A-1").build(),
                InventoryItem.builder().partNumber("MOT-7100-10W50").name("Motul 7100 4T 10W50 100% Synthetic Oil (1L)").category("Engine Oil").stockQuantity(12).minThreshold(10).unitPrice(new BigDecimal("850.00")).locationBin("Rack A-2").build(),
                InventoryItem.builder().partNumber("BRK-PAD-RE350").name("Bosch Front Disc Brake Pads (Classic 350)").category("Brakes").stockQuantity(2).minThreshold(8).unitPrice(new BigDecimal("420.00")).locationBin("Bin B-3").build(),
                InventoryItem.builder().partNumber("BRK-SHOE-ACT").name("KBX Rear Brake Shoe Set (Activa 6G)").category("Brakes").stockQuantity(18).minThreshold(10).unitPrice(new BigDecimal("280.00")).locationBin("Bin B-4").build(),
                InventoryItem.builder().partNumber("SPK-NGK-CPR8").name("NGK Laser Iridium Spark Plug CPR8EAIX-9").category("Ignition").stockQuantity(3).minThreshold(10).unitPrice(new BigDecimal("680.00")).locationBin("Drawer C-2").build(),
                InventoryItem.builder().partNumber("FLT-AIR-ACT6G").name("Original OEM Air Filter (Activa 6G)").category("Filters").stockQuantity(5).minThreshold(12).unitPrice(new BigDecimal("220.00")).locationBin("Rack D-1").build(),
                InventoryItem.builder().partNumber("FLT-OIL-RE350").name("Royal Enfield Genuine Oil Filter Element").category("Filters").stockQuantity(14).minThreshold(8).unitPrice(new BigDecimal("180.00")).locationBin("Rack D-2").build(),
                InventoryItem.builder().partNumber("CHN-LUB-ROL400").name("Rolon Heavy Duty Chain Lube Spray (400ml)").category("Transmission").stockQuantity(24).minThreshold(10).unitPrice(new BigDecimal("350.00")).locationBin("Rack E-1").build()
        );

        inventoryRepository.saveAll(items);
        log.info("✅ Seeded {} spare parts into inventory table", items.size());
    }

    private void seedVehiclesAndJobs(User c1, User c2) {
        if (vehicleRepository.count() > 0) return;

        // Rahul's Bike 1
        Vehicle re350 = Vehicle.builder()
                .registrationNumber("MH 12 AB 1234")
                .make("Royal Enfield")
                .model("Classic 350")
                .year(2023)
                .engineCc("349cc")
                .odometerKm(14250)
                .lastServiceDate(LocalDate.now().minusMonths(3))
                .user(c1)
                .build();
        vehicleRepository.save(re350);

        // Rahul's Bike 2
        Vehicle activa = Vehicle.builder()
                .registrationNumber("MH 12 XY 9876")
                .make("Honda")
                .model("Activa 6G")
                .year(2022)
                .engineCc("109cc")
                .odometerKm(8600)
                .lastServiceDate(LocalDate.now().minusMonths(5))
                .user(c1)
                .build();
        vehicleRepository.save(activa);

        // Pooja's Bike
        Vehicle jupiter = Vehicle.builder()
                .registrationNumber("MH 14 CD 5678")
                .make("TVS")
                .model("Jupiter 125")
                .year(2023)
                .engineCc("124cc")
                .odometerKm(6200)
                .lastServiceDate(LocalDate.now().minusMonths(2))
                .user(c2)
                .build();
        vehicleRepository.save(jupiter);

        // Active Live Job Card for Rahul's Classic 350
        JobCard activeJob = JobCard.builder()
                .jobNumber("JOB-2026-081")
                .vehicle(re350)
                .customer(c1)
                .serviceType("Full General Service & Engine Tune-up")
                .status("IN_PROGRESS")
                .stageNumber(3)
                .stageName("Spares Replacement & Engine Flush")
                .assignedMechanic("Suresh Mistry (Senior Mechanic)")
                .estimatedCompletion("Today, 05:30 PM")
                .diagnosticNotes("Tappet sound adjusted, synthetic engine oil flushed, front disc brake pads replaced.")
                .laborCharges(new BigDecimal("1200.00"))
                .partsTotal(new BigDecimal("1970.00"))
                .grandTotal(new BigDecimal("3170.00"))
                .build();
        jobCardRepository.save(activeJob);

        // Add Parts to Active Job
        InventoryItem motulOil = inventoryRepository.findByPartNumberIgnoreCase("MOT-5100-15W50").orElse(null);
        InventoryItem brakePad = inventoryRepository.findByPartNumberIgnoreCase("BRK-PAD-RE350").orElse(null);
        InventoryItem oilFilter = inventoryRepository.findByPartNumberIgnoreCase("FLT-OIL-RE350").orElse(null);

        JobCardPart p1 = JobCardPart.builder().jobCard(activeJob).inventoryItem(motulOil).partName("Motul 5100 4T 15W50 (2.5L)").quantity(3).unitPrice(new BigDecimal("550.00")).totalPrice(new BigDecimal("1370.00")).build();
        JobCardPart p2 = JobCardPart.builder().jobCard(activeJob).inventoryItem(brakePad).partName("Bosch Front Disc Brake Pads").quantity(1).unitPrice(new BigDecimal("420.00")).totalPrice(new BigDecimal("420.00")).build();
        JobCardPart p3 = JobCardPart.builder().jobCard(activeJob).inventoryItem(oilFilter).partName("Genuine Oil Filter Element").quantity(1).unitPrice(new BigDecimal("180.00")).totalPrice(new BigDecimal("180.00")).build();
        jobCardPartRepository.saveAll(List.of(p1, p2, p3));

        // Historical Delivered Job & Invoice for Rahul
        JobCard pastJob = JobCard.builder()
                .jobNumber("JOB-2026-044")
                .vehicle(re350)
                .customer(c1)
                .serviceType("10,000 km Periodic Service + Synthetic Oil")
                .status("DELIVERED")
                .stageNumber(5)
                .stageName("Delivered to Customer")
                .assignedMechanic("Sanjay Bhai")
                .estimatedCompletion("Completed")
                .diagnosticNotes("Routine periodic service completed with road test ok.")
                .laborCharges(new BigDecimal("850.00"))
                .partsTotal(new BigDecimal("1565.00"))
                .grandTotal(new BigDecimal("2850.00"))
                .build();
        jobCardRepository.save(pastJob);

        Invoice inv = Invoice.builder()
                .invoiceNumber("INV-2026-0442")
                .jobCard(pastJob)
                .customer(c1)
                .laborAmount(new BigDecimal("850.00"))
                .partsAmount(new BigDecimal("1565.00"))
                .subtotal(new BigDecimal("2415.00"))
                .gstRate(new BigDecimal("18.00"))
                .gstAmount(new BigDecimal("435.00"))
                .grandTotal(new BigDecimal("2850.00"))
                .paymentStatus("PAID")
                .paymentMode("UPI (Google Pay)")
                .invoiceDate(LocalDate.now().minusMonths(3))
                .build();
        invoiceRepository.save(inv);

        // Appointment
        Appointment app = Appointment.builder()
                .customer(c1)
                .customerName("Rahul Sharma")
                .phone("+91 98230 12345")
                .bikeModel("Royal Enfield Classic 350")
                .serviceType("Chain Lube & General Checkup")
                .appointmentDate(LocalDate.now().plusDays(3))
                .timeSlot("Morning (09:30 AM - 12:30 PM)")
                .notes("Check minor vibration in rear mudguard")
                .status("CONFIRMED")
                .build();
        appointmentRepository.save(app);
    }
}
