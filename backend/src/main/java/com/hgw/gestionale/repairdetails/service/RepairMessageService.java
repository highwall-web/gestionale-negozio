package com.hgw.gestionale.repairdetails.service;

import com.hgw.gestionale.common.exception.NotFoundException;
import com.hgw.gestionale.repairdetails.dto.AddMessageRequest;
import com.hgw.gestionale.repairdetails.dto.RepairMessageResponse;
import com.hgw.gestionale.repairdetails.entity.RepairDetails;
import com.hgw.gestionale.repairdetails.entity.RepairMessage;
import com.hgw.gestionale.repairdetails.mapper.RepairMessageMapper;
import com.hgw.gestionale.repairdetails.repository.RepairDetailsRepository;
import com.hgw.gestionale.repairdetails.repository.RepairMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RepairMessageService {

    private final RepairDetailsRepository repairDetailsRepository;
    private final RepairMessageRepository repairMessageRepository;

    public RepairMessageResponse addMessage(Long repairId, AddMessageRequest request, String autore) {
        RepairDetails details = repairDetailsRepository.findByRepairId(repairId)
                .orElseThrow(() -> new NotFoundException("RepairDetails not found for repair id=" + repairId));

        RepairMessage message = RepairMessage.builder()
                .repairDetails(details)
                .testo(request.testo())
                .autore(autore)
                .createdAt(LocalDateTime.now())
                .build();

        return RepairMessageMapper.toResponse(repairMessageRepository.save(message));
    }

    public void deleteMessage(Long messageId) {
        if (!repairMessageRepository.existsById(messageId)) {
            throw new NotFoundException("Message not found id=" + messageId);
        }
        repairMessageRepository.deleteById(messageId);
    }
}
