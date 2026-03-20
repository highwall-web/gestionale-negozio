package com.hgw.gestionale.customer.controller;

import com.hgw.gestionale.customer.dto.CreateCustomerRequest;
import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.customer.dto.UpdateCustomerRequest;
import com.hgw.gestionale.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/customers", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping
    public CustomerResponse createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        log.info("CustomerController.create creazione cliente");
        return customerService.create(request);
    }

    @GetMapping
    public List<CustomerResponse> getAllCustomers() {
        log.info("CustomerController.getAll richiesta lista clienti");
        return customerService.getAll();
    }

    @GetMapping("/search")
    public List<CustomerResponse> searchCustomers(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cognome,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String email
    ) {
        log.info("CustomerController.search nome={} cognome={} telefono={} email={}", nome, cognome, telefono, email);
        return customerService.search(nome, cognome, telefono, email);
    }

    

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable Long id) {
        log.info("CustomerController.getById richiesta cliente id={}", id);
        return customerService.getById(id);
    }

    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request
    ) {
        log.info("CustomerController.update aggiornamento cliente id={}", id);
        return customerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        log.info("CustomerController.delete eliminazione cliente id={}", id);
        customerService.delete(id);
    }
}
