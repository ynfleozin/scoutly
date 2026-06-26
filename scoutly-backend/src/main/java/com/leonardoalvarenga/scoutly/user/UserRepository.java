package com.leonardoalvarenga.scoutly.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.isGuest = true AND u.createdAt < :targetTime")
    void deleteExpiredGuests(LocalDateTime targetTime);
}
