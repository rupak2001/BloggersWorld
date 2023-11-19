package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.entity.UserTable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccessTokenService {
    private final JwtEncoder jwtEncoder;
    public AccessTokenService(JwtEncoder encoder){
        this.jwtEncoder = encoder;
    }


    public String generateToken(UserTable userTable){
        List<GrantedAuthority> authorities = Arrays.stream(userTable.getRole().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        Instant now = Instant.now();
        String scope = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority->!authority.startsWith("ROLE"))
                .collect(Collectors.joining(" "));
        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(24, ChronoUnit.HOURS))
                .subject(userTable.getEmail())
                .claim("scope",scope)
                .build();

        var encoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS512).build(),claimsSet);
        return this.jwtEncoder.encode(encoderParameters).getTokenValue();
    }

    private Boolean isTokenExpired(Jwt jwtCreds) {
        try{
            return jwtCreds.getExpiresAt().isBefore(Instant.now());
        }
        catch (NullPointerException nullPointerException){
            return false;
        }
    }

    public Boolean validateToken(Jwt jwtCreds, UserDetails userDetails) {
        final String username = jwtCreds.getSubject();
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtCreds));
    }
}
