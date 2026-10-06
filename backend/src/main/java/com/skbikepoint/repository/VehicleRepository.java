package com.skbikepoint.repository;

import com.skbikepoint.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Vehicle> findByRegistrationNumberIgnoreCase(String registrationNumber);
    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);
}
