package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.response.CustomerResponse;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.entities.Customer;
import com.example.ecom.entities.Product;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.CustomerRepository;
import com.example.ecom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final EntityMapper entityMapper;
    
    public CustomerResponse getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return entityMapper.toCustomerResponse(customer);
    }
    
    @Transactional
    public CustomerResponse updateCustomer(UUID id, CustomerResponse updates) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        customer.setFirstName(updates.getFirstName());
        customer.setLastName(updates.getLastName());
        customer.setPhone(updates.getPhone());
        customer.setShippingAddress(updates.getShippingAddress());
        customer.setBillingAddress(updates.getBillingAddress());
        
        Customer updatedCustomer = customerRepository.save(customer);
        return entityMapper.toCustomerResponse(updatedCustomer);
    }
    
    @Transactional
    public void addToWishlist(UUID customerId, UUID productId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!customer.getWishlist().contains(product)) {
            customer.getWishlist().add(product);
            customerRepository.save(customer);
        }
    }
    
    public List<ProductResponse> getWishlist(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return entityMapper.toProductResponseList(customer.getWishlist());
    }
}
