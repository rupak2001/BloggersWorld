package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.EditRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import com.bloggersworld.BWBackend.DTO.projections.ProfileProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ProfileService{
    ProfileProjection getUser(HttpServletRequest request);

    List<AuthorBlogsProjection> getBlogs(Long id);

    String editUserBasic(EditRequest request);

    boolean checkIfValidOldPassword(UserTable userTable, String oldPassword);

    void changePassword(UserTable userTable, String newPassword);

    UserTable findUser(HttpServletRequest request);
}
