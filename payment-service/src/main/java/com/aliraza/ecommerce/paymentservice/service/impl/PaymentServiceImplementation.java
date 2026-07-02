package com.aliraza.ecommerce.paymentservice.service.impl;


import com.aliraza.ecommerce.paymentservice.dto.PaymentRequest;
import com.aliraza.ecommerce.paymentservice.dto.PaymentResponse;
import com.aliraza.ecommerce.paymentservice.mapper.PaymentMapper;
import com.aliraza.ecommerce.paymentservice.model.Payment;
import com.aliraza.ecommerce.paymentservice.repository.PaymentRepository;
import com.aliraza.ecommerce.paymentservice.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImplementation implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public PaymentServiceImplementation(PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    @Override
    public PaymentResponse createPayment(PaymentRequest request) {
        if (paymentRepository.existsByOrderId(request.orderId())) {
            throw new IllegalArgumentException("Payment already exists for orderId: " + request.orderId());
        }

        Payment payment = new Payment(
                request.orderId(),
                request.customerId(),
                request.amount(),
                request.paymentMethod()
        );

        Payment savedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID id) {
        Payment payment = getPaymentEntityById(id);

        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(String orderId) {
        Payment payment = getPaymentEntityByOrderId(orderId);

        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByCustomerId(String customerId) {
        return paymentRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Override
    public PaymentResponse completePayment(String orderId) {
        Payment payment = getPaymentEntityByOrderId(orderId);

        payment.complete();

        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse failPayment(String orderId) {
        Payment payment = getPaymentEntityByOrderId(orderId);

        payment.fail();

        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse refundPayment(String orderId) {
        Payment payment = getPaymentEntityByOrderId(orderId);

        payment.refund();

        return paymentMapper.toResponse(payment);
    }

    private Payment getPaymentEntityById(UUID id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + id));
    }

    private Payment getPaymentEntityByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with orderId: " + orderId));
    }
}