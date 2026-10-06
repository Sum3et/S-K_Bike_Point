package com.skbikepoint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.skbikepoint.entity")
@EnableJpaRepositories("com.skbikepoint.repository")
public class SkBikePointApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkBikePointApplication.class, args);
    }
}
