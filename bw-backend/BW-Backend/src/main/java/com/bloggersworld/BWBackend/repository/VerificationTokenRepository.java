package com.bloggersworld.BWBackend.repository;

import com.bloggersworld.BWBackend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken,Long> {
    VerificationToken findByToken(String token);

    @Query("SELECT v from VerificationToken v WHERE v.user.email = ?1")
    VerificationToken findByEmail(String email);
}
