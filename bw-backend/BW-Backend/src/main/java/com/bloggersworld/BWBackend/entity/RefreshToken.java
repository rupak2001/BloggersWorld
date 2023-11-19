package com.bloggersworld.BWBackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Entity
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    private Instant expiryDate;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "refreshtokentouser",referencedColumnName = "id")
    private UserTable userTable;
}
