package com.aliraza.ecommerce.paymentservice.service;

import com.aliraza.ecommerce.paymentservice.dto.PaymentRequest;
import com.aliraza.ecommerce.paymentservice.dto.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    PaymentResponse getPaymentById(UUID id);

    PaymentResponse getPaymentByOrderId(String orderId);

    List<PaymentResponse> getPaymentsByCustomerId(String customerId);

    List<PaymentResponse> getAllPayments();

    PaymentResponse completePayment(String orderId);

    PaymentResponse failPayment(String orderId);

    PaymentResponse refundPayment(String orderId);
}
