package com.leonardoalvarenga.scoutly.tracking;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TrackingServiceTest {

    @Mock
    private TrackedProductRepository repository;

    @InjectMocks
    private TrackingService service;

    @Test
    void shouldDeactivateAlert(){
        UUID id = UUID.randomUUID();

        TrackedProduct product = new TrackedProduct();

        when(repository.findById(id))
                .thenReturn(Optional.of(product));

        service.deactivateAlert(id);

        assertFalse(product.isActive());

        verify(repository).save(product);
    }

    @Test
    void shouldThrowExceptionWhenProductNotFound(){
        UUID id = UUID.randomUUID();

        when(repository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> service.deactivateAlert(id));

        verify(repository, never()).save(any());
    }
}
