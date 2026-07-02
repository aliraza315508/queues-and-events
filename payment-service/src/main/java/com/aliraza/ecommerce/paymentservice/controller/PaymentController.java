package com.aliraza.ecommerce.paymentservice.controller;

import com.aliraza.ecommerce.paymentservice.dto.PaymentRequest;
import com.aliraza.ecommerce.paymentservice.dto.PaymentResponse;
import com.aliraza.ecommerce.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment
            (@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();

        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable UUID id) {
        PaymentResponse response = paymentService.getPaymentById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable String orderId) {
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCustomerId(@PathVariable String customerId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByCustomerId(customerId);

        return ResponseEntity.ok(payments);
    }

    @PatchMapping("/order/{orderId}/complete")
    public ResponseEntity<PaymentResponse> completePayment(@PathVariable String orderId) {
        PaymentResponse response = paymentService.completePayment(orderId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/order/{orderId}/fail")
    public ResponseEntity<PaymentResponse> failPayment(@PathVariable String orderId) {
        PaymentResponse response = paymentService.failPayment(orderId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/order/{orderId}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable String orderId) {
        PaymentResponse response = paymentService.refundPayment(orderId);

        return ResponseEntity.ok(response);
    }
}
