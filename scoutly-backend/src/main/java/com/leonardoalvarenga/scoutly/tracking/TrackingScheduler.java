package com.leonardoalvarenga.scoutly.tracking;

import com.leonardoalvarenga.scoutly.messaging.RabbitMQConfig;
import com.leonardoalvarenga.scoutly.messaging.ScrapeProductMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TrackingScheduler {
    private final TrackedProductRepository repository;
    private final RabbitTemplate template;

    @Scheduled(cron = "0 0 0 * * *")
    public void triggerDailyScraping() {
        List<TrackedProduct> activeProducts = repository.findByActiveTrue();

        activeProducts.forEach(product -> {

            ScrapeProductMessage message = new ScrapeProductMessage(
                    product.getId(),
                    product.getUrl()
            );

            template.convertAndSend(
                    RabbitMQConfig.SCRAPING_QUEUE,
                    message
            );
        });
    }
}
