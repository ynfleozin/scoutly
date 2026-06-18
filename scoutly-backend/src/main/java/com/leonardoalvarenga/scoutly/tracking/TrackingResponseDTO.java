package com.leonardoalvarenga.scoutly.tracking;

import java.math.BigDecimal;
import java.util.UUID;

public record TrackingResponseDTO(
        UUID id,
        String name,
        String url,
        BigDecimal targetPrice,
        BigDecimal currentPrice,
        boolean active
) {
}
