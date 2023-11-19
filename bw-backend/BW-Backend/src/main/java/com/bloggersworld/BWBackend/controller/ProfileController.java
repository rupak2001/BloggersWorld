package com.bloggersworld.BWBackend.controller;

import com.bloggersworld.BWBackend.DTO.EditRequest;
import com.bloggersworld.BWBackend.DTO.PasswordModel;
import com.bloggersworld.BWBackend.DTO.projections.AuthorBlogsProjection;
import com.bloggersworld.BWBackend.DTO.projections.BlogProjection;
import com.bloggersworld.BWBackend.DTO.projections.ProfileProjection;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/user")
public class ProfileController {
    private final ProfileService profileService;
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ProfileProjection getProfile(HttpServletRequest request){
        return profileService.getUser(request);
    }

    @GetMapping("/get-blogs")
    public List<AuthorBlogsProjection> getBlogs(@RequestParam("id") Long id){
        return profileService.getBlogs(id);
    }

    @PostMapping("/edit-basic")
    public ResponseEntity<String> editUserBasic(@RequestBody EditRequest request){
        String res = profileService.editUserBasic(request);
        if(res.equals("Success")) return ResponseEntity.status(HttpStatus.ACCEPTED)
                                                            .body("Edit Successful");
        if(res.equals("Exists")) return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("User with same Email Exists");

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Error");

    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordModel passwordModel,HttpServletRequest request){
        UserTable userTable = profileService.findUser(request);
        if(userTable != null){
            if(!profileService.checkIfValidOldPassword(userTable,passwordModel.getOldPassword())){
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Invalid Old Password");
            }
            profileService.changePassword(userTable, passwordModel.getNewPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid User");
    }
}
