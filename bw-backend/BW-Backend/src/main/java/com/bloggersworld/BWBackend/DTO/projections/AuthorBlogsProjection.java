package com.bloggersworld.BWBackend.DTO.projections;

import java.time.Instant;

public interface AuthorBlogsProjection {
    Instant getBlogupdated();
    Long getId();
    String getBlogtitle();
    String getBlogdesc();
    boolean getIsPublished();

}
