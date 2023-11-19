package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.UserRegistrationRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.entity.VerificationToken;
import com.bloggersworld.BWBackend.repository.UserRepository;
import com.bloggersworld.BWBackend.repository.VerificationTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Calendar;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private VerificationTokenRepository verificationTokenRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, VerificationTokenRepository verificationTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationTokenRepository = verificationTokenRepository;
    }

    @Override
    public UserTable registerUser(UserRegistrationRequest registrationRequest) {
        if(userRepository.findByEmail(registrationRequest.getEmail())!=null){
            return null;
        }
        UserTable user = UserTable.builder()
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .fullName(registrationRequest.getFirstName()+" "+registrationRequest.getLastName())
                .bio(registrationRequest.getBio())
                .dp(registrationRequest.getDp())
                .doj(Instant.now())
                .role("USER")
                .datetime_created(Instant.now())
                .datetime_updated(Instant.now())
                .build();
        userRepository.save(user);
        return  user;
    }

    @Override
    public void saveVerificationTokenForUser(String token, UserTable user) {
        VerificationToken verificationToken = new VerificationToken(user,token);
        verificationTokenRepository.save(verificationToken);
    }

    @Override
    public String validateVerificationToken(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);

        if(verificationToken == null) return "invalid";

        UserTable userTable = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();

        //check the token is expired or not
        if(verificationToken.getExpirationTime().getTime() - cal.getTime().getTime() <=0){
            verificationTokenRepository.delete(verificationToken);
            return "expired";
        }

        userTable.setActivated(true);
        userRepository.save(userTable);

        return "valid";
    }

    @Override
    public VerificationToken generateNewVerificationToken(String oldToken) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(oldToken);
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationTokenRepository.save(verificationToken);
        return verificationToken;
    }

    @Override
    public UserTable findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    @Override
    public AuthorProjection getAuthor(Long id) {
        return userRepository.getAuthor(id);
    }

    @Override
    public VerificationToken getOldToken(String email) {
        return verificationTokenRepository.findByEmail(email);
    }


}
