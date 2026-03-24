package com.hgw.gestionale.repairdetails.mapper;

import com.hgw.gestionale.repairdetails.dto.RepairMessageResponse;
import com.hgw.gestionale.repairdetails.entity.RepairMessage;

public final class RepairMessageMapper {

    private RepairMessageMapper() {}

    public static RepairMessageResponse toResponse(RepairMessage message) {
        return new RepairMessageResponse(
                message.getId(),
                message.getTesto(),
                message.getAutore(),
                message.getCreatedAt()
        );
    }
}
