package com.aliraza.ecommerce.inventoryservice.service;


import com.aliraza.ecommerce.inventoryservice.dto.InventoryRequest;
import com.aliraza.ecommerce.inventoryservice.dto.InventoryResponse;
import com.aliraza.ecommerce.inventoryservice.dto.UpdateStockRequest;

import java.util.List;
import java.util.UUID;

public interface InventoryService {

    InventoryResponse createInventory(InventoryRequest request);

    InventoryResponse getInventoryById(UUID id);

    InventoryResponse getInventoryByProductId(String productId);

    List<InventoryResponse> getAllInventory();

    InventoryResponse addStock(String productId, UpdateStockRequest request);

    InventoryResponse reserveStock(String productId, UpdateStockRequest request);

    InventoryResponse releaseReservedStock(String productId, UpdateStockRequest request);

    InventoryResponse confirmReservedStock(String productId, UpdateStockRequest request);
}
