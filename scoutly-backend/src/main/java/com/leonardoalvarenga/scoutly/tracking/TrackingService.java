package com.leonardoalvarenga.scoutly.tracking;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackingService {
    private final TrackedProductRepository repository;

    public TrackingResponseDTO add(TrackingRequestDTO dto){
        TrackedProduct entity = new TrackedProduct();
        entity.setName(dto.name());
        entity.setUrl(dto.url());
        entity.setTargetPrice(dto.targetPrice());

        entity.setUserId("userMock-123");

        TrackedProduct savedEntity = repository.save(entity);

        return new TrackingResponseDTO(
                savedEntity.getId(),
                savedEntity.getName(),
                savedEntity.getUrl(),
                savedEntity.getTargetPrice(),
                savedEntity.isActive()
        );
    }

    public List<TrackingResponseDTO> findAll(){
        return repository.findAll()
                .stream()
                .map(product -> new TrackingResponseDTO(
                        product.getId(),
                        product.getName(),
                        product.getUrl(),
                        product.getTargetPrice(),
                        product.isActive()
                ))
                .toList();
    }

    public void delete (UUID id){
        repository.deleteById(id);
    }

    public void deactivateAlert(UUID id){
        TrackedProduct product = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        product.deactivateAlert();

        repository.save(product);
    }
}
