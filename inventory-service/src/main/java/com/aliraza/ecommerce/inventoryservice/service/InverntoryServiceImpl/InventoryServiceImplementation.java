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


@Service
@Transactional
public class InventoryServiceImplementation implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    public InventoryServiceImplementation(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
        this.inventoryMapper = inventoryMapper;
    }






    @Override
    public InventoryResponse createInventory(InventoryRequest request) {
        if(inventoryRepository.existsByProductId(request.productId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Inventory already exists for productId: " + request.productId());
        }

    Inventory inventory = inventoryMapper.toEntity(request);

    Inventory savedInventory = inventoryRepository.save(inventory);
    return inventoryMapper.toResponse(savedInventory);

    }







    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryById(UUID id) {
        
        Inventory inventory = inventoryRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException
        (HttpStatus.NOT_FOUND, "Inventory not found with id: " + id));
        
        return inventoryMapper.toResponse(inventory);
        
    }





    @Transactional(readOnly = true)
    @Override
    public InventoryResponse getInventoryByProductId(String productId) {
        
        Inventory inventory = getInventoryEntityByProductId(productId);
        
        return inventoryMapper.toResponse(inventory);
    }






    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll()
        .stream()
        .map(inventoryMapper::toResponse)
        .toList();
    }







    @Override
    public InventoryResponse addStock(String productId, UpdateStockRequest request) {
        
        Inventory inventory = getInventoryEntityByProductId(productId);
        inventory.addStock(request.quantity());
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(savedInventory);
        
    }









    @Override
    public InventoryResponse reserveStock(String productId, UpdateStockRequest request) {
         Inventory inventory = getInventoryEntityByProductId(productId);
         inventory.reserveStock(request.quantity());
         Inventory savedInventory = inventoryRepository.save(inventory);
         return inventoryMapper.toResponse(savedInventory);
    }








    @Override
    public InventoryResponse releaseReservedStock(String productId, UpdateStockRequest request) {
       
        Inventory inventory = getInventoryEntityByProductId(productId);
        inventory.releaseReservedStock(request.quantity());
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(savedInventory);
       
    }







    @Override
    public InventoryResponse confirmReservedStock(String productId, UpdateStockRequest request) {
        
        Inventory inventory = getInventoryEntityByProductId(productId);
        inventory.confirmReservedStock(request.quantity());
        Inventory savedInventory = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(savedInventory);
    }





        private Inventory getInventoryEntityByProductId(String productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inventory not found for productId: " + productId
                ));
    }
}













