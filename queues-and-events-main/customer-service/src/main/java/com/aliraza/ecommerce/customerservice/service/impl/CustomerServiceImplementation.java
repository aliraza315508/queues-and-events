package com.aliraza.ecommerce.customerservice.service.impl;

import com.aliraza.ecommerce.customerservice.dto.CreateCustomerRequest;
import com.aliraza.ecommerce.customerservice.dto.CustomerResponse;
import com.aliraza.ecommerce.customerservice.mapper.CustomerMapper;
import com.aliraza.ecommerce.customerservice.model.Customer;
import com.aliraza.ecommerce.customerservice.repository.CustomerRepository;
import com.aliraza.ecommerce.customerservice.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerServiceImplementation implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerServiceImplementation(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }





    @Override
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Customer email already exists");
        }

        Customer customer = new Customer(
                request.fullName(),
                request.email(),
                request.phone()
        );

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(savedCustomer);

    }





    @Override
    public CustomerResponse getCustomerById(UUID id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        return customerMapper.toResponse(customer);

    }





    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerMapper.toResponseList(customerRepository.findAll());
    }
}
