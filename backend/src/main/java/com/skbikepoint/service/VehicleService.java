package com.skbikepoint.service;

import com.skbikepoint.dto.vehicle.VehicleDto;
import com.skbikepoint.dto.vehicle.VehicleRequest;
import com.skbikepoint.entity.User;
import com.skbikepoint.entity.Vehicle;
import com.skbikepoint.exception.BadRequestException;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.UserRepository;
import com.skbikepoint.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        return mapToDto(vehicle);
    }

    @Transactional
    public VehicleDto createVehicle(Long userId, VehicleRequest request) {
        String cleanReg = request.getRegistrationNumber().trim().toUpperCase();
        if (vehicleRepository.existsByRegistrationNumberIgnoreCase(cleanReg)) {
            throw new BadRequestException("Vehicle with registration number '" + cleanReg + "' is already registered");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(cleanReg)
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .engineCc(request.getEngineCc())
                .odometerKm(request.getOdometerKm())
                .user(user)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", "id", id);
        }
        vehicleRepository.deleteById(id);
    }

    public VehicleDto mapToDto(Vehicle vehicle) {
        return VehicleDto.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .engineCc(vehicle.getEngineCc())
                .odometerKm(vehicle.getOdometerKm())
                .lastServiceDate(vehicle.getLastServiceDate())
                .customerId(vehicle.getUser() != null ? vehicle.getUser().getId() : null)
                .customerName(vehicle.getUser() != null ? vehicle.getUser().getName() : null)
                .build();
    }
}
