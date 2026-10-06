package com.skbikepoint.repository;

import com.skbikepoint.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerIdOrderByAppointmentDateDesc(Long customerId);
    List<Appointment> findTop20ByOrderByAppointmentDateDesc();
}
