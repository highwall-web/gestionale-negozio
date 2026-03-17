package com.hgw.gestionale.color.controller;

import com.hgw.gestionale.color.dto.ColorResponse;
import com.hgw.gestionale.color.dto.CreateColorRequest;
import com.hgw.gestionale.color.dto.UpdateColorRequest;
import com.hgw.gestionale.color.service.ColorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colors")
@RequiredArgsConstructor
@Slf4j
public class ColorController {
    private final ColorService colorService;

    @PostMapping
    public ColorResponse createColor(@Valid @RequestBody CreateColorRequest request) {
        log.info("ColorController.create creazione color: {}", request.nome());
        return colorService.create(request);
    }

    @GetMapping
    public List<ColorResponse> getAllColors() {
        log.info("ColorController.getAll richiesta lista color");
        return colorService.getAll();
    }

    @GetMapping("/{id}")
    public ColorResponse getColorById(@PathVariable Long id) {
        log.info("ColorController.getById richiesta color id={}", id);
        return colorService.getById(id);
    }

    @GetMapping("/by-name/{nome}")
    public ColorResponse getColorByName(@PathVariable String nome) {
        log.info("ColorController.getByName richiesta color nome={}", nome);
        return colorService.getByName(nome);
    }

    @GetMapping("/search")
    public List<ColorResponse> searchColor(@RequestParam String nome) {
        log.info("ColorController.search ricerca color nome={}", nome);
        return colorService.search(nome);
    }

    @PutMapping("/{id}")
    public ColorResponse updateColor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateColorRequest request
    ) {
        log.info("ColorController.update aggiornamento color id={}", id);
        return colorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteColor(@PathVariable Long id) {
        log.info("ColorController.delete eliminazione color id={}", id);
        colorService.delete(id);
    }
}
