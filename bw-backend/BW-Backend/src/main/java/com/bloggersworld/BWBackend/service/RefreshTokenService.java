package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.entity.RefreshToken;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.repository.RefreshTokenRepository;
import com.bloggersworld.BWBackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken createRefreshToken(String username){
        UserTable userTable = userRepository.findByEmail(username);
        RefreshToken oldRefreshToken = refreshTokenRepository.findByUserTable(userTable);
        if(oldRefreshToken != null){
            refreshTokenRepository.delete(oldRefreshToken);
        }
        Instant now = Instant.now();
        RefreshToken refreshToken = RefreshToken.builder()
                .userTable(userRepository.findByEmail(username))
                .token(UUID.randomUUID().toString())
                .expiryDate(now.plus(365, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public Optional<RefreshToken> getRefreshToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyRefreshToken(RefreshToken refreshToken){
        if(refreshToken.getExpiryDate().compareTo(Instant.now()) < 0){
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException(refreshToken.getToken() + ": this token is expired;");
        }
        return refreshToken;
    }
}
