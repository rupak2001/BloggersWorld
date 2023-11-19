package com.bloggersworld.BWBackend.DTO.projections;

import com.bloggersworld.BWBackend.entity.UserTable;

public interface SearchAuthorProjection {
    String getId();
    String getFirstName();
    String getLastName();

    String getFullName();
}
