package com.leonardoalvarenga.scoutly.tracking;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TrackingController {
    private final TrackingService service;

    @Value("${scoutly.webhook.secret}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<TrackingResponseDTO> create(@Valid @RequestBody TrackingRequestDTO dto) {
        TrackingResponseDTO response = service.add(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TrackingResponseDTO>> get() {
        List<TrackingResponseDTO> productsList = service.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(productsList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void toggleStatus(@PathVariable UUID id) {
        service.toggleStatus(id);
    }

    @PostMapping("/webhook/price")
    public ResponseEntity<Void> updatePrice(
            @RequestHeader(value = "X-Scoutly-Secret", required = false) String secret,
            @Valid @RequestBody PriceWebhookDTO dto) {

        if (secret == null || !secret.equals(webhookSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        service.updatePrice(dto);
        return ResponseEntity.ok().build();
    }
}
