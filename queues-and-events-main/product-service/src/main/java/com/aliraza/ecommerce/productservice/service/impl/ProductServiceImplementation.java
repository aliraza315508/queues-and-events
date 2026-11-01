package com.aliraza.ecommerce.productservice.service.impl;


import com.aliraza.ecommerce.productservice.dto.ProductRequest;
import com.aliraza.ecommerce.productservice.dto.ProductResponse;
import com.aliraza.ecommerce.productservice.mapper.ProductMapper;
import com.aliraza.ecommerce.productservice.model.Product;
import com.aliraza.ecommerce.productservice.repository.ProductRepository;
import com.aliraza.ecommerce.productservice.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImplementation implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductServiceImplementation(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }





    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySkuIgnoreCase(request.sku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Product with sku already exists"
            );
        }

        Product product = new Product();
        product.setSku(request.sku());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setActive(true);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);

    }





    @Override
    public ProductResponse getProductById(UUID id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found"
                ));

        return productMapper.toResponse(product);

    }





    @Override
    public List<ProductResponse> getAllProducts() {
        return productMapper.toResponseList(productRepository.findAll());
    }
}
