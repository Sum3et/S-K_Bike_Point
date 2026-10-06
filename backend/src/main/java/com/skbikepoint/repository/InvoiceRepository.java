package com.skbikepoint.repository;

import com.skbikepoint.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumberIgnoreCase(String invoiceNumber);
    Optional<Invoice> findByJobCardId(Long jobCardId);
    List<Invoice> findByCustomerIdOrderByInvoiceDateDesc(Long customerId);
    List<Invoice> findTop10ByOrderByInvoiceDateDesc();
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.paymentStatus = 'PENDING'")
    long countPendingInvoices();
}
