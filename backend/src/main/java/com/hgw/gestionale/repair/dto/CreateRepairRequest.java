package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.product.dto.CreateProductRequest;
import com.hgw.gestionale.repairdetails.dto.CreateRepairDetailsRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record CreateRepairRequest(
        @Valid @NotNull Long customerId,
        @Valid @NotNull CreateProductRequest product,
        @Valid @NotNull CreateRepairDetailsRequest details
) {
}
