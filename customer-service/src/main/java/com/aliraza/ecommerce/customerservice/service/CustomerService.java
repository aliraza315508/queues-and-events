package com.aliraza.ecommerce.customerservice.service;

import com.aliraza.ecommerce.customerservice.dto.CreateCustomerRequest;
import com.aliraza.ecommerce.customerservice.dto.CustomerResponse;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerResponse createCustomer(CreateCustomerRequest request);

    CustomerResponse getCustomerById(UUID id);

    List<CustomerResponse> getAllCustomers();
}
