package com.leonardoalvarenga.scoutly.tracking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;

public record TrackingRequestDTO(

    @NotBlank
    String name,

    @NotBlank
    @URL
    String url,

    @NotNull
    @Positive
    BigDecimal targetPrice
) {
}
