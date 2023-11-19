package com.bloggersworld.BWBackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Calendar;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class VerificationToken {

    //Expiration time
    private static final int Expiration_Time = 10; //10 minutes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    private Date expirationTime;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "FK_USER_VERIFY_TOKEN"))
    private UserTable user;

    public VerificationToken(UserTable user, String token) {
        super();
        this.user = user;
        this.token = token;
        this.expirationTime = calculateExpirationDate(Expiration_Time);
    }

    public VerificationToken(String token) {
        super();
        this.token = token;
        this.expirationTime = calculateExpirationDate(Expiration_Time);
    }

    private Date calculateExpirationDate(int expirationTime) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, expirationTime);
        return new Date(calendar.getTime().getTime());
    }
}