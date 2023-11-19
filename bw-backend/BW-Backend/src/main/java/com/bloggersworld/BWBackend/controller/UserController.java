package com.bloggersworld.BWBackend.controller;


import com.bloggersworld.BWBackend.DTO.*;
import com.bloggersworld.BWBackend.entity.RefreshToken;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.entity.VerificationToken;
import com.bloggersworld.BWBackend.event.RegistrationEvent;
import com.bloggersworld.BWBackend.service.AccessTokenService;
import com.bloggersworld.BWBackend.service.RefreshTokenService;
import com.bloggersworld.BWBackend.service.UserService;
import com.bloggersworld.BWBackend.utils.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    private final AuthUtils authUtils;

    private final AuthenticationManager authenticationManager;

    private final RefreshTokenService refreshTokenService;

    private final AccessTokenService accessTokenService;

    public UserController(UserService userService, ApplicationEventPublisher publisher, AuthUtils authUtils, AuthenticationManager authenticationManager, RefreshTokenService refreshTokenService, AccessTokenService accessTokenService) {
        this.userService = userService;
        this.publisher = publisher;
        this.authUtils = authUtils;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.accessTokenService = accessTokenService;
    }

    @GetMapping("/hello")
    public String printHello(){
        return "hello world";
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationRequest registrationRequest,final HttpServletRequest request){
        UserTable user = userService.registerUser(registrationRequest);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User Exists");
        publisher.publishEvent(new RegistrationEvent(
                user,
                authUtils.applicationUrl(request)));
        return ResponseEntity.status(HttpStatus.CREATED).body("User Created");
    }

    @GetMapping("/verifyRegistration")
    public String verifyRegistration(@RequestParam("token") String token){
        String result = userService.validateVerificationToken(token);
        if(result.equalsIgnoreCase("valid")) return "User verified Successfully";
        return "This link is either expired or invalid";
    }

    @PostMapping("/resend-verification")
    public String resendVerificationToken(@RequestBody ResendVerificationRequest resendVerificationRequest, HttpServletRequest request){
        VerificationToken oldToken = userService.getOldToken(resendVerificationRequest.getEmail());
        VerificationToken verificationToken = userService.generateNewVerificationToken(oldToken.getToken());
        UserTable userTable = verificationToken.getUser();
        authUtils.resendVerificationTokenMail(userTable,authUtils.applicationUrl(request),verificationToken);
        return "Resent Successfully";
    }


    @PostMapping("/login")
    public JwtResponse authenticateAndGetToken(@RequestBody LoginRequest loginModel, HttpServletResponse response){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginModel.getEmail(),loginModel.getPassword()));

        if(authentication.isAuthenticated()){
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(loginModel.getEmail());
            UserTable userTable = userService.findUserByEmail(loginModel.getEmail());
//            Cookie accessTokenCookie = new Cookie("accessToken",accessTokenService.generateToken(userTable));
//            accessTokenCookie.setSecure(true);
//            accessTokenCookie.setHttpOnly(true);
//            accessTokenCookie.setMaxAge(24 * 60 * 60);
//            accessTokenCookie.setPath("/");
//
//            Cookie refreshTokenCookie = new Cookie("refreshToken",refreshToken.getToken());
//            refreshTokenCookie.setSecure(true);
//            refreshTokenCookie.setHttpOnly(true);
//            refreshTokenCookie.setMaxAge(24 * 60 * 60);
//            refreshTokenCookie.setPath("/");
//
//            response.addCookie(accessTokenCookie);
//            response.addCookie(refreshTokenCookie);
//
//            System.out.println(response);
//            return ResponseEntity.status(HttpStatus.OK).body("Success");

            return JwtResponse.builder()
                    .accessToken(accessTokenService.generateToken(userTable))
                    .refreshToken(refreshToken.getToken())
                    .build();
        }

//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials")
        return null;
    }

    @PostMapping("/refreshToken")
    public JwtResponse refreshToken(@RequestBody RefreshTokenRequest request){
        return refreshTokenService.getRefreshToken(request.getToken())
                .map(refreshTokenService::verifyRefreshToken)
                .map(RefreshToken::getUserTable)
                .map(userTable -> {
                    String newToken = accessTokenService.generateToken(userTable);

                    return  JwtResponse.builder()
                            .accessToken(newToken)
                            .refreshToken(request.getToken())
                            .build();
                })
                .orElseThrow(()->new RuntimeException("Refresh Token isn't in the DB"));
    }

}
