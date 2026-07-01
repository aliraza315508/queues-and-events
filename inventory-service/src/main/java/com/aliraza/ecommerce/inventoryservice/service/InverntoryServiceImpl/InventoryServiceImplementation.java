package com.aliraza.ecommerce.inventoryservice.service.InverntoryServiceImpl;

import com.aliraza.ecommerce.inventoryservice.dto.InventoryRequest;
import com.aliraza.ecommerce.inventoryservice.dto.InventoryResponse;
import com.aliraza.ecommerce.inventoryservice.dto.UpdateStockRequest;
import com.aliraza.ecommerce.inventoryservice.model.Inventory;
import com.aliraza.ecommerce.inventoryservice.repository.InventoryRepository;
import com.aliraza.ecommerce.inventoryservice.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

public class InventoryServiceImplementation implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImplementation(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }


    @Override
    public InventoryResponse createInventory(InventoryRequest request) {
        if(inventoryRepository.existsByProductId(request.productId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Inventory already exists for productId: " + request.productId());
        }

        Inventory inventory = new Inventory(
                request.productId(),
                request.availableQuantity()
        );

        Inventory savedInventory = inventoryRepository.save(inventory);


        return null ;
    }

    @Override
    public InventoryResponse getInventoryById(UUID id) {
        return null;
    }

    @Override
    public InventoryResponse getInventoryByProductId(String productId) {
        return null;
    }

    @Override
    public List<InventoryResponse> getAllInventory() {
        return List.of();
    }

    @Override
    public InventoryResponse addStock(String productId, UpdateStockRequest request) {
        return null;
    }

    @Override
    public InventoryResponse reserveStock(String productId, UpdateStockRequest request) {
        return null;
    }

    @Override
    public InventoryResponse releaseReservedStock(String productId, UpdateStockRequest request) {
        return null;
    }

    @Override
    public InventoryResponse confirmReservedStock(String productId, UpdateStockRequest request) {
        return null;
    }
}

