package com.leonardoalvarenga.scoutly.tracking;

import com.leonardoalvarenga.scoutly.messaging.RabbitMQConfig;
import com.leonardoalvarenga.scoutly.messaging.ScrapeProductMessage;
import com.leonardoalvarenga.scoutly.user.User;
import com.leonardoalvarenga.scoutly.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final TrackedProductRepository repository;
    private final RabbitTemplate rabbitTemplate;

    private final UserRepository userRepository;

    private final List<String> supportedDomains = List.of("books.toscrape.com", "amazon.com.br", "amazon.com");

    public TrackingResponseDTO add(TrackingRequestDTO dto) {

        String domain = extractDomain(dto.url());
        if (!supportedDomains.contains(domain)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loja não suportada");
        }

        TrackedProduct entity = new TrackedProduct();
        entity.setName(dto.name());
        entity.setUrl(dto.url());
        entity.setTargetPrice(dto.targetPrice());

        User mockUser = userRepository.findByEmail("mock@scoutly.com")
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName("Usuário Teste");
                    newUser.setEmail("mock@scoutly.com");
                    newUser.setGuest(true);
                    return userRepository.save(newUser);
                });

        entity.setUser(mockUser);

        TrackedProduct savedEntity = repository.save(entity);

        ScrapeProductMessage message = new ScrapeProductMessage(
                savedEntity.getId(),
                savedEntity.getUrl()
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.SCRAPING_QUEUE,
                message
        );

        return new TrackingResponseDTO(
                savedEntity.getId(),
                savedEntity.getName(),
                savedEntity.getUrl(),
                savedEntity.getTargetPrice(),
                null,
                savedEntity.isActive()
        );
    }

    public List<TrackingResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(product -> {
                    BigDecimal latestPrice = product.getPrices().isEmpty()
                            ? null
                            : product.getPrices().get(product.getPrices().size() - 1).getPrice();

                    return new TrackingResponseDTO(
                            product.getId(),
                            product.getName(),
                            product.getUrl(),
                            product.getTargetPrice(),
                            latestPrice,
                            product.isActive()
                    );
                }).toList();
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public void toggleStatus(UUID id) {
        TrackedProduct product = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        product.setActive(!product.isActive());

        repository.save(product);
    }

    @Transactional
    public void updatePrice(PriceWebhookDTO dto) {
        TrackedProduct product = repository.findById(dto.productId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        PriceHistory history = new PriceHistory();

        history.setPrice(dto.price());

        product.addPriceHistory(history);

        repository.save(product);
    }

    private String extractDomain(String urlString) {
        try {
            java.net.URI uri = new java.net.URI(urlString);
            String domain = uri.getHost();
            return domain.startsWith("www.") ? domain.substring(4) : domain;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "URL inválida");
        }
    }
}
