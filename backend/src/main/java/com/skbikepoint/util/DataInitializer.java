package com.skbikepoint.util;

import com.skbikepoint.entity.Role;
import com.skbikepoint.entity.User;
import com.skbikepoint.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
    }

    private void seedUsers() {
        // Seed Admin User
        if (!userRepository.existsByEmail("admin@skbikepoint.com")) {
            User admin = User.builder()
                    .name("Sanjay Kumar Yadav (Workshop Head)")
                    .email("admin@skbikepoint.com")
                    .phone("+91 98699 04097")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
            log.info("✅ Demo Admin user seeded: admin@skbikepoint.com / Admin@123");
        }

        // Seed Default Customer User
        if (!userRepository.existsByEmail("customer@example.com")) {
            User customer = User.builder()
                    .name("Rahul Sharma")
                    .email("customer@example.com")
                    .phone("+91 98230 12345")
                    .password(passwordEncoder.encode("Customer@123"))
                    .role(Role.ROLE_CUSTOMER)
                    .active(true)
                    .build();

            userRepository.save(customer);
            log.info("✅ Demo Customer user seeded: customer@example.com / Customer@123");
        }

        // Seed Second Customer User
        if (!userRepository.existsByEmail("pooja.patel@example.com")) {
            User customer2 = User.builder()
                    .name("Pooja Patel")
                    .email("pooja.patel@example.com")
                    .phone("+91 97654 67890")
                    .password(passwordEncoder.encode("Customer@123"))
                    .role(Role.ROLE_CUSTOMER)
                    .active(true)
                    .build();

            userRepository.save(customer2);
            log.info("✅ Demo Customer 2 seeded: pooja.patel@example.com / Customer@123");
        }
    }
}
