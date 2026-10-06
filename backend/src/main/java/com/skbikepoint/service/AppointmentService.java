package com.skbikepoint.service;

import com.skbikepoint.dto.appointment.AppointmentDto;
import com.skbikepoint.dto.appointment.AppointmentRequest;
import com.skbikepoint.entity.Appointment;
import com.skbikepoint.entity.User;
import com.skbikepoint.exception.ResourceNotFoundException;
import com.skbikepoint.repository.AppointmentRepository;
import com.skbikepoint.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findTop20ByOrderByAppointmentDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAppointmentsByCustomerId(Long customerId) {
        return appointmentRepository.findByCustomerIdOrderByAppointmentDateDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDto createAppointment(Long customerId, AppointmentRequest request) {
        User customer = null;
        if (customerId != null) {
            customer = userRepository.findById(customerId).orElse(null);
        }

        Appointment app = Appointment.builder()
                .customer(customer)
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .bikeModel(request.getBikeModel())
                .serviceType(request.getServiceType())
                .appointmentDate(request.getAppointmentDate())
                .timeSlot(request.getTimeSlot())
                .notes(request.getNotes())
                .status("CONFIRMED")
                .build();

        return mapToDto(appointmentRepository.save(app));
    }

    @Transactional
    public AppointmentDto updateStatus(Long id, String status) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        app.setStatus(status);
        return mapToDto(appointmentRepository.save(app));
    }

    public AppointmentDto mapToDto(Appointment a) {
        return AppointmentDto.builder()
                .id(a.getId())
                .customerId(a.getCustomer() != null ? a.getCustomer().getId() : null)
                .customerName(a.getCustomerName())
                .phone(a.getPhone())
                .bikeModel(a.getBikeModel())
                .serviceType(a.getServiceType())
                .appointmentDate(a.getAppointmentDate())
                .timeSlot(a.getTimeSlot())
                .notes(a.getNotes())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
