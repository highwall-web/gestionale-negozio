package com.hgw.gestionale.brand.controller;

import com.hgw.gestionale.brand.dto.BrandResponse;
import com.hgw.gestionale.brand.dto.CreateBrandRequest;
import com.hgw.gestionale.brand.dto.UpdateBrandRequest;
import com.hgw.gestionale.brand.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/brands", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class BrandController {
    private final BrandService brandService;

    @PostMapping
    public BrandResponse createBrand(@Valid @RequestBody CreateBrandRequest request) {
        log.info("BrandController.create creazione brand: {}", request.nome());
        return brandService.create(request);
    }

    @GetMapping
    public List<BrandResponse> getAllBrands() {
        log.info("BrandController.getAll richiesta lista brand");
        return brandService.getAll();
    }

    @GetMapping("/{id}")
    public BrandResponse getBrandById(@PathVariable Long id) {
        log.info("BrandController.getById richiesta brand id={}", id);
        return brandService.getById(id);
    }

    @GetMapping("/by-name/{nome}")
    public BrandResponse getBrandByName(@PathVariable String nome) {
        log.info("BrandController.getByName richiesta brand nome={}", nome);
        return brandService.getByName(nome);
    }

    @GetMapping("/search")
    public List<BrandResponse> searchBrand(@RequestParam String nome) {
        log.info("BrandController.search ricerca brand nome={}", nome);
        return brandService.search(nome);
    }

    @PutMapping("/{id}")
    public BrandResponse updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBrandRequest request
    ) {
        log.info("BrandController.update aggiornamento brand id={}", id);
        return brandService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable Long id) {
        log.info("BrandController.delete eliminazione brand id={}", id);
        brandService.delete(id);
    }
}
