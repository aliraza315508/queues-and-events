package com.aliraza.ecommerce.paymentservice.repository;


import com.aliraza.ecommerce.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(String orderId);

    List<Payment> findByCustomerIdOrderByCreatedAtDesc(String customerId);

    boolean existsByOrderId(String orderId);
}
