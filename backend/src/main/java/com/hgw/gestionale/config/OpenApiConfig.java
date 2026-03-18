package com.hgw.gestionale.config;

import com.hgw.gestionale.common.dto.ApiError;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI backendOpenAPI() {
        var schemas = ModelConverters.getInstance().read(ApiError.class);
        return new OpenAPI()
                .info(new Info()
                        .title("Gestionale Negozio API")
                        .description("API del gestionale negozio")
                        .version("1.0.0"))
                .components(new Components().schemas(schemas));
    }

    @Bean
    OperationCustomizer globalErrorResponses() {
        Schema<ApiError> errorSchema = new Schema<ApiError>().$ref("#/components/schemas/ApiError");
        Content errorContent = new Content().addMediaType(
                org.springframework.http.MediaType.APPLICATION_JSON_VALUE,
                new MediaType().schema(errorSchema)
        );

        Map<String, ApiResponse> errorResponses = Map.of(
                "400", new ApiResponse().description("Richiesta non valida").content(errorContent),
                "401", new ApiResponse().description("Non autenticato").content(errorContent),
                "403", new ApiResponse().description("Non autorizzato").content(errorContent),
                "404", new ApiResponse().description("Risorsa non trovata").content(errorContent),
                "409", new ApiResponse().description("Conflitto - risorsa già esistente").content(errorContent),
                "500", new ApiResponse().description("Errore interno del server").content(errorContent)
        );

        return (operation, handlerMethod) -> {
            errorResponses.forEach((code, response) ->
                    operation.getResponses().addApiResponse(code, response)
            );
            return operation;
        };
    }
}
