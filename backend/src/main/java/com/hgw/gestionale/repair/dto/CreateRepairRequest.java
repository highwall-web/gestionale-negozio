package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.customer.dto.CreateCustomerRequest;
import com.hgw.gestionale.product.dto.CreateProductRequest;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateRepairRequest(
        Long customerId,
        @Valid @NotNull CreateCustomerRequest customer,
        @Valid @NotNull CreateProductRequest product,
        @Valid @NotNull CreateRepairDetailsRequest details
) {
}
