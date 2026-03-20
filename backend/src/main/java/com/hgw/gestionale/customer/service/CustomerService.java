package com.hgw.gestionale.customer.service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.customer.dto.CreateCustomerRequest;
import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.customer.dto.UpdateCustomerRequest;
import com.hgw.gestionale.customer.entity.Customer;
import com.hgw.gestionale.customer.mapper.CustomerMapper;
import com.hgw.gestionale.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerResponse create(CreateCustomerRequest request) {
        Customer customer = CustomerMapper.toEntity(request);

        Customer savedCustomer = customerRepository.save(customer);

        return CustomerMapper.toResponse(savedCustomer);
    }

    public List<CustomerResponse> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerMapper::toResponse)
                .toList();
    }

    public CustomerResponse getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id: " + id));

        return CustomerMapper.toResponse(customer);
    }

    public CustomerResponse update(Long id, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id: " + id));

        CustomerMapper.updateEntity(customer, request);

        Customer updated = customerRepository.save(customer);

        return CustomerMapper.toResponse(updated);
    }

    public void delete(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id: " + id));

        customerRepository.deleteById(customer.getId());
    }

    public List<CustomerResponse> search(String nome, String cognome, String telefono, String email) {
        return customerRepository.search(nome, cognome, telefono, email)
                .stream()
                .map(CustomerMapper::toResponse)
                .toList();
    }
}
