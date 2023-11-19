package com.bloggersworld.BWBackend.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String bio;
    private String dp;

}
