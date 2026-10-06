package com.skbikepoint.repository;

import com.skbikepoint.entity.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard, Long> {
    Optional<JobCard> findByJobNumberIgnoreCase(String jobNumber);
    
    @Query("SELECT j FROM JobCard j WHERE LOWER(j.jobNumber) = LOWER(:query) OR LOWER(j.vehicle.registrationNumber) = LOWER(:query) ORDER BY j.createdAt DESC")
    List<JobCard> findByJobNumberOrVehicleRegistration(@Param("query") String query);

    List<JobCard> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<JobCard> findTop10ByOrderByCreatedAtDesc();

    long countByStatus(String status);

    @Query("SELECT COUNT(j) FROM JobCard j WHERE j.status NOT IN ('DELIVERED', 'CANCELLED')")
    long countActiveJobs();

    @Query("SELECT COALESCE(SUM(j.grandTotal), 0) FROM JobCard j WHERE j.createdAt >= :startDate AND j.status != 'CANCELLED'")
    BigDecimal calculateRevenueSince(@Param("startDate") LocalDateTime startDate);
}
