package com.bloggersworld.BWBackend.filter;

import com.bloggersworld.BWBackend.service.AccessTokenService;
import com.bloggersworld.BWBackend.service.UserConfigService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.security.auth.login.CredentialExpiredException;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@ControllerAdvice
@Configuration
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private UserConfigService userConfigService;

    @Autowired
    private AccessTokenService accessTokenService;

    @ExceptionHandler(JwtValidationException.class)
    public ResponseEntity<String> handleExpiredJwtException(JwtValidationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Your access token has expired.");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
//        if(authHeader != null){
//            String key = "accessToken";
//            Optional<String> optAuthHeader =  Arrays.stream(request.getCookies())
//                    .filter(c -> key.equals(c.getName()))
//                    .map(Cookie::getValue)
//                    .findAny();

//            if(optAuthHeader.isPresent()) token = optAuthHeader.get();
//            token=authHeader.substring(7);
//        }

        String username = null;
        Jwt jwtCreds = null;

        if(authHeader!= null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7); //removing Bearer
            jwtCreds = jwtDecoder.decode(token);
            username = jwtCreds.getSubject();
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails =  userConfigService.loadUserByUsername(username);
            if(accessTokenService.validateToken(jwtCreds,userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                        = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        filterChain.doFilter(request,response);
    }
}