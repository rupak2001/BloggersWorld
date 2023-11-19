package com.bloggersworld.BWBackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

//TODO: add full name column for proper search

@Entity
@Data
@Table(name = "User")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private String fullName;
    private String dp;
    private Instant doj;
    private String bio;
    private String role;
    private Instant datetime_created;
    private Instant datetime_updated;
    private boolean isActivated=false;

}
