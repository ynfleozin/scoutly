package com.leonardoalvarenga.scoutly.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class GuestCleanupScheduler {

    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpiredGuests(){
        log.info("Iniciando limpeza de usuários demo expirados");
        LocalDateTime threshold = LocalDateTime.now().minusHours(2);

        userRepository.deleteExpiredGuests(threshold);

        log.info("Limpeza concluída com sucesso!");
    }
}
