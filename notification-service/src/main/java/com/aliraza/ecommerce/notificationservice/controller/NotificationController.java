package com.aliraza.ecommerce.notificationservice.controller;

import com.aliraza.ecommerce.notificationservice.dto.NotificationRequest;
import com.aliraza.ecommerce.notificationservice.dto.NotificationResponse;
import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request
    ) {
        NotificationResponse response = notificationService.createNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable UUID id) {
        NotificationResponse response = notificationService.getNotificationById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> response = notificationService.getAllNotifications();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByOrderId(@PathVariable String orderId) {
        List<NotificationResponse> response = notificationService.getNotificationsByOrderId(orderId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByCustomerId(@PathVariable String customerId) {
        List<NotificationResponse> response = notificationService.getNotificationsByCustomerId(customerId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByStatus(@PathVariable NotificationStatus status) {
        List<NotificationResponse> response = notificationService.getNotificationsByStatus(status);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{notificationType}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByType(
            @PathVariable NotificationType notificationType
    ) {
        List<NotificationResponse> response = notificationService.getNotificationsByType(notificationType);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/queue")
    public ResponseEntity<NotificationResponse> queueNotification(@PathVariable UUID id) {
        NotificationResponse response = notificationService.queueNotification(id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/sent")
    public ResponseEntity<NotificationResponse> markNotificationAsSent(@PathVariable UUID id) {
        NotificationResponse response = notificationService.markNotificationAsSent(id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/failed")
    public ResponseEntity<NotificationResponse> markNotificationAsFailed(@PathVariable UUID id) {
        NotificationResponse response = notificationService.markNotificationAsFailed(id);

        return ResponseEntity.ok(response);
    }
}
