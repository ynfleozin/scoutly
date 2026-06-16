package com.leonardoalvarenga.scoutly.tracking;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record PriceWebhookDTO(

        @NotNull
        UUID productId,

        @NotNull
        @Positive
        BigDecimal price
) {
}
