package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.UserRegistrationRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.entity.VerificationToken;

public interface UserService {
    UserTable registerUser(UserRegistrationRequest registrationRequest);

    void saveVerificationTokenForUser(String token, UserTable user);

    String validateVerificationToken(String token);

    VerificationToken generateNewVerificationToken(String oldToken);

    UserTable findUserByEmail(String email);

    AuthorProjection getAuthor(Long id);

    VerificationToken getOldToken(String email);
}
