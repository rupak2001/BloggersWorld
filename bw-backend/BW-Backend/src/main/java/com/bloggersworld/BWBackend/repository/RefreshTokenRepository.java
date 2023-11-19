package com.bloggersworld.BWBackend.repository;

import com.bloggersworld.BWBackend.entity.RefreshToken;
import com.bloggersworld.BWBackend.entity.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    RefreshToken findByUserTable(UserTable userTable);
    Optional<RefreshToken> findByToken(String token);
}
