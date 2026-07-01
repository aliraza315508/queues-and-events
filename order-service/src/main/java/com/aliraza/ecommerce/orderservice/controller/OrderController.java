package com.aliraza.ecommerce.orderservice.controller;

import com.aliraza.ecommerce.orderservice.dto.CreateOrderRequest;
import com.aliraza.ecommerce.orderservice.dto.OrderResponse;
import com.aliraza.ecommerce.orderservice.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false) String customerId
    ) {
        if (customerId != null && !customerId.isBlank()) {
            return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
        }

        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
