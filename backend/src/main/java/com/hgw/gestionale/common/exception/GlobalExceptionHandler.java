package com.hgw.gestionale.common.exception;

import com.hgw.gestionale.common.dto.ApiError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<String> handleApiException(ApiException ex){
        ApiError apiError = new ApiError(
                ex.getMessage(),
                Instant.now()
        );

        return ResponseEntity.status(ex.getStatus()).body(apiError.toString());
    }
}
