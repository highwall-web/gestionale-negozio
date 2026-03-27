package com.hgw.gestionale.customer.mapper;

import com.hgw.gestionale.customer.dto.CreateCustomerRequest;
import com.hgw.gestionale.customer.dto.CustomerResponse;
import com.hgw.gestionale.customer.dto.UpdateCustomerRequest;
import com.hgw.gestionale.customer.entity.Customer;

public final class CustomerMapper {

    private CustomerMapper() {}

    public static Customer toEntity(CreateCustomerRequest request) {
        return Customer.builder()
                .nome(request.nome())
                .cognome(request.cognome())
                .email(request.email())
                .indirizzo(request.indirizzo())
                .citta(request.citta())
                .cap(request.cap())
                .telefono(request.telefono())
                .telefonoSecondario(request.telefonoSecondario())
                .build();
    }

    public static CustomerResponse toResponse(Customer customer){
        return new CustomerResponse(
                customer.getId(),
                customer.getNome(),
                customer.getCognome(),
                customer.getEmail(),
                customer.getIndirizzo(),
                customer.getCitta(),
                customer.getCap(),
                customer.getTelefono(),
                customer.getTelefonoSecondario()
        );
    }

    public static void updateEntity(Customer customer, UpdateCustomerRequest request){
        customer.setNome(request.nome());
        customer.setCognome(request.cognome());
        customer.setEmail(request.email());
        customer.setIndirizzo(request.indirizzo());
        customer.setCitta(request.citta());
        customer.setCap(request.cap());
        customer.setTelefono(request.telefono());
        customer.setTelefonoSecondario(request.telefonoSecondario());
    }

    public static void updateEntity(Customer customer, CreateCustomerRequest request){
        customer.setNome(request.nome());
        customer.setCognome(request.cognome());
        customer.setEmail(request.email());
        customer.setIndirizzo(request.indirizzo());
        customer.setCitta(request.citta());
        customer.setCap(request.cap());
        customer.setTelefono(request.telefono());
        customer.setTelefonoSecondario(request.telefonoSecondario());
    }

}
