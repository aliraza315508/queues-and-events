package com.aliraza.ecommerce.orderservice.service;

import com.aliraza.ecommerce.orderservice.dto.CreateOrderRequest;
import com.aliraza.ecommerce.orderservice.dto.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse getOrderById(UUID id);

    List<OrderResponse> getOrdersByCustomerId(String customerId);

    List<OrderResponse> getAllOrders();
}
