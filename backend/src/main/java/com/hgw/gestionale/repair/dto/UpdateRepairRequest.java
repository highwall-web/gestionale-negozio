package com.hgw.gestionale.repair.dto;

import com.hgw.gestionale.statorepair.StatoRepair;
import com.hgw.gestionale.statoriparazione.StatoRiparazione;
import jakarta.validation.constraints.NotNull;

public record UpdateRepairRequest(
        @NotNull Long customerId,
        StatoRepair stato,
        StatoRiparazione statoRiparazione
) {
}
