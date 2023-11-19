package com.bloggersworld.BWBackend.DTO.projections;

import java.time.Instant;

public interface ProfileProjection {
    Long getId();
    String getEmail();
    String getFirstName();
    String getLastName();
    Instant getDoj();
    String getBio();
    String getDp();
    Boolean getIsActivated();
}
