package com.bloggersworld.BWBackend.repository;

import com.bloggersworld.BWBackend.DTO.projections.AuthorProjection;
import com.bloggersworld.BWBackend.DTO.projections.ProfileProjection;
import com.bloggersworld.BWBackend.DTO.projections.SearchAuthorProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<UserTable,Long> {
    UserTable findByEmail(String email);

    @Query("Select u from UserTable u where u.firstName LIKE :search% OR u.lastName LIKE :search% OR u.fullName LIKE :search%")
    List<SearchAuthorProjection> searchAuthors(@Param("search") String search);

    @Query("Select u from UserTable u where u.id = ?1")
    AuthorProjection getAuthor(Long id);

    ProfileProjection getUserTableByEmail(String username);
}
