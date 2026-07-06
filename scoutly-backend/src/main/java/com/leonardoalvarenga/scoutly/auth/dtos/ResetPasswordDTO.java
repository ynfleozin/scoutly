package com.leonardoalvarenga.scoutly.auth.dtos;

public record ResetPasswordDTO(String token, String newPassword) {
}
