package com.aliraza.ecommerce.inventoryservice.controller;

import com.aliraza.ecommerce.inventoryservice.dto.InventoryRequest;
import com.aliraza.ecommerce.inventoryservice.dto.InventoryResponse;
import com.aliraza.ecommerce.inventoryservice.dto.UpdateStockRequest;
import com.aliraza.ecommerce.inventoryservice.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryResponse createInventory(@Valid @RequestBody InventoryRequest request) {
        return inventoryService.createInventory(request);
    }

    @GetMapping("/{id}")
    public InventoryResponse getInventoryById(@PathVariable UUID id) {
        return inventoryService.getInventoryById(id);
    }

    @GetMapping("/product/{productId}")
    public InventoryResponse getInventoryByProductId(@PathVariable String productId) {
        return inventoryService.getInventoryByProductId(productId);
    }

    @GetMapping
    public List<InventoryResponse> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @PatchMapping("/product/{productId}/add-stock")
    public InventoryResponse addStock(
            @PathVariable String productId,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        return inventoryService.addStock(productId, request);
    }

    @PatchMapping("/product/{productId}/reserve")
    public InventoryResponse reserveStock(
            @PathVariable String productId,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        return inventoryService.reserveStock(productId, request);
    }

    @PatchMapping("/product/{productId}/release")
    public InventoryResponse releaseReservedStock(
            @PathVariable String productId,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        return inventoryService.releaseReservedStock(productId, request);
    }

    @PatchMapping("/product/{productId}/confirm")
    public InventoryResponse confirmReservedStock(
            @PathVariable String productId,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        return inventoryService.confirmReservedStock(productId, request);
    }
}