package com.leonardoalvarenga.scoutly.auth;

import com.leonardoalvarenga.scoutly.auth.dtos.AuthResponseDTO;
import com.leonardoalvarenga.scoutly.auth.dtos.LoginRequestDTO;
import com.leonardoalvarenga.scoutly.auth.dtos.RegisterRequestDTO;
import com.leonardoalvarenga.scoutly.notification.EmailService;
import com.leonardoalvarenga.scoutly.user.User;
import com.leonardoalvarenga.scoutly.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public AuthResponseDTO login(LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());
        return new AuthResponseDTO(token);
    }

    public void register(RegisterRequestDTO data) {
        if (this.userRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        String encryptedPassword = passwordEncoder.encode(data.password());

        User newUser = new User();
        newUser.setName(data.name());
        newUser.setEmail(data.email());
        newUser.setPassword(encryptedPassword);
        newUser.setGuest(false);

        this.userRepository.save(newUser);
    }

    public AuthResponseDTO guestLogin() {
        String guestId = UUID.randomUUID().toString().substring(0, 8);
        String guestEmail = "guest_" + guestId + "@scoutly.local";

        User guestUser = new User();
        guestUser.setName("Visitante");
        guestUser.setEmail(guestEmail);
        guestUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        guestUser.setGuest(true);

        this.userRepository.save(guestUser);

        var token = tokenService.generateToken(guestUser);
        return new AuthResponseDTO(token);
    }

    public void requestPasswordReset(String email) {
        var userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);

        tokenRepository.save(resetToken);

        String resetLink = "https://scoutly-sand.vercel.app/reset-password?token=" + token;
        String htmlBody = "<div style=\"font-family: Arial, sans-serif; color: #333;\">"
                + "<h2 style=\"color: #10C07F;\">Recuperação de Senha - Scoutly</h2>"
                + "<p>Olá, " + user.getName() + "!</p>"
                + "<p>Recebemos um pedido para redefinir a sua senha. Clique no botão abaixo para criar uma nova (o link expira em 15 minutos):</p>"
                + "<a href=\"" + resetLink + "\" style=\"display: inline-block; padding: 10px 20px; background-color: #10C07F; color: #FEFEFE; text-decoration: none; border-radius: 5px; margin-top: 10px;\">Criar Nova Senha</a>"
                + "<p style=\"margin-top: 20px; font-size: 0.8rem; color: #666;\">Se você não solicitou esta alteração, apenas ignore este e-mail.</p>"
                + "</div>";

        emailService.sendHtmlEmail(user.getEmail(), "Redefinição de Senha - Scoutly", htmlBody);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou não encontrado."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Este link já expirou. Tente novamente");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
