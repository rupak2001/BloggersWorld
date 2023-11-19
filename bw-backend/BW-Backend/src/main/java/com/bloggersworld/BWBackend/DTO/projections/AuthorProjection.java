package com.bloggersworld.BWBackend.DTO.projections;

import java.time.Instant;

public interface AuthorProjection {
    Long getId();
    String getFirstName();
    String getLastName();
    Instant getDoj();
    String getBio();
    String getDp();
}
