package com.bloggersworld.BWBackend.DTO.projections;

import com.bloggersworld.BWBackend.entity.Category;

import java.time.Instant;
import java.util.List;

public interface BlogProjection {
    Long getId();
    String getBlogtitle();
    String getBlogdesc();
    String getBlogcontent();
    String getTimetoread();
    List<String> getTags();
    Category getBlogcategory();
    UserTable getAuthor();
    Instant getBlogupdated();
    interface UserTable{
        Long getId();

        String getEmail();
        String getFirstName();
        String getLastName();
    }
}