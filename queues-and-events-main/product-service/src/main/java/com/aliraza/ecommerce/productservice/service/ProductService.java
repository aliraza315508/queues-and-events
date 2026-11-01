package com.aliraza.ecommerce.productservice.service;


import com.aliraza.ecommerce.productservice.dto.ProductRequest;
import com.aliraza.ecommerce.productservice.dto.ProductResponse;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(UUID id);

    List<ProductResponse> getAllProducts();
}
