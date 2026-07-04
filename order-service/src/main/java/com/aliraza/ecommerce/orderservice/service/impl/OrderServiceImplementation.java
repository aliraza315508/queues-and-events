package com.aliraza.ecommerce.orderservice.service.impl;

import com.aliraza.ecommerce.orderservice.dto.CreateOrderRequest;
import com.aliraza.ecommerce.orderservice.dto.OrderResponse;
import com.aliraza.ecommerce.orderservice.event.OrderCancelledEvent;
import com.aliraza.ecommerce.orderservice.event.OrderConfirmedEvent;
import com.aliraza.ecommerce.orderservice.event.OrderCreatedEvent;
import com.aliraza.ecommerce.orderservice.mapper.OrderMapper;
import com.aliraza.ecommerce.orderservice.model.Order;
import com.aliraza.ecommerce.orderservice.model.OrderStatus;
import com.aliraza.ecommerce.orderservice.producer.OrderEventProducer;
import com.aliraza.ecommerce.orderservice.producer.OrderStatusEventProducer;
import com.aliraza.ecommerce.orderservice.repository.OrderRepository;
import com.aliraza.ecommerce.orderservice.service.OrderService;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OrderServiceImplementation implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderEventProducer orderEventProducer;
    private final OrderStatusEventProducer orderStatusEventProducer;

    public OrderServiceImplementation(
            OrderRepository orderRepository,
            OrderMapper orderMapper,
            OrderEventProducer orderEventProducer,
            OrderStatusEventProducer orderStatusEventProducer
    ) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.orderEventProducer = orderEventProducer;
        this.orderStatusEventProducer = orderStatusEventProducer;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        BigDecimal totalAmount = request.unitPrice()
                .multiply(BigDecimal.valueOf(request.quantity()));

        Order order = new Order(
                request.customerId(),
                request.productId(),
                request.quantity(),
                request.unitPrice(),
                totalAmount,
                OrderStatus.CREATED
        );

        Order savedOrder = orderRepository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent(
                UUID.randomUUID() ,
                savedOrder.getId(),
                savedOrder.getCustomerId(),
                savedOrder.getProductId(),
                savedOrder.getQuantity(),
                savedOrder.getUnitPrice(),
                savedOrder.getTotalAmount(),
                Instant.now()
        );

        orderEventProducer.publishOrderCreated(event);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        return orderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByCustomerId(String customerId) {
        return orderMapper.toResponseList(
                orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
        );
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderMapper.toResponseList(
                orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }



    @Override
    @Transactional
    public void confirmOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);

        OrderConfirmedEvent event = new OrderConfirmedEvent(
                UUID.randomUUID(),
                savedOrder.getId(),
                savedOrder.getCustomerId(),
                Instant.now()
        );

        orderStatusEventProducer.publishOrderConfirmed(event);
    }


    @Override
    @Transactional
    public void cancelOrder(UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found"
                ));

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        OrderCancelledEvent event = new OrderCancelledEvent(
                UUID.randomUUID(),
                savedOrder.getId(),
                savedOrder.getCustomerId(),
                reason,
                Instant.now()
        );

        orderStatusEventProducer.publishOrderCancelled(event);
    }


}