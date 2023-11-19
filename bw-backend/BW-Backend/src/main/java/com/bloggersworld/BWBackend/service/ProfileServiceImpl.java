package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.DTO.EditRequest;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.ProfileProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.repository.BlogRepository;
import com.bloggersworld.BWBackend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService{

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtDecoder jwtDecoder;

    public ProfileServiceImpl(BlogRepository blogRepository, UserRepository profileRepository, PasswordEncoder passwordEncoder, JwtDecoder jwtDecoder) {
        this.blogRepository = blogRepository;
        this.userRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public ProfileProjection getUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        String username = null;
        Jwt jwtCreds = null;

        if(authHeader!= null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7); //removing Bearer
            jwtCreds = jwtDecoder.decode(token);
            username = jwtCreds.getSubject();
        }
        return userRepository.getUserTableByEmail(username);
    }

    @Override
    public List<AuthorBlogsProjection> getBlogs(Long id) {
        return blogRepository.getBlogByAuthorIdOrderByBlogupdatedDesc(id);
    }

    @Override
    public String editUserBasic(EditRequest request) {
        Optional<UserTable> userTableOpt = userRepository.findById(request.getId());
        UserTable userTable = userTableOpt.get();
        if(!userTable.getEmail().equals(request.getEmail())) {
            UserTable otherUser = userRepository.findByEmail(request.getEmail());
            if (otherUser != null) return "Exists";
        }
        if(request.getFirstName() != null) userTable.setFirstName(request.getFirstName());
        if(request.getLastName() != null) userTable.setLastName(request.getLastName());
        if(request.getEmail() != null) userTable.setEmail(request.getEmail());
        if(request.getBio() != null) userTable.setBio(request.getBio());
        if(request.getDp() != null) userTable.setDp(request.getDp());
        userTable.setFullName(userTable.getFirstName()+" "+userTable.getLastName());
        userRepository.save(userTable);
        return "Success";
    }

    @Override
    public boolean checkIfValidOldPassword(UserTable userTable, String oldPassword) {
        return passwordEncoder.matches(oldPassword,userTable.getPassword());
    }

    @Override
    public void changePassword(UserTable userTable, String newPassword) {
        userTable.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userTable);
    }

    @Override
    public UserTable findUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        String username = null;
        Jwt jwtCreds = null;

        if(authHeader!= null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7); //removing Bearer
            jwtCreds = jwtDecoder.decode(token);
            username = jwtCreds.getSubject();
        }
        return userRepository.findByEmail(username);
    }
}
