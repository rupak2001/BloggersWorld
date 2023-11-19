package com.bloggersworld.BWBackend.DTO;

import lombok.Data;

@Data
public class PasswordModel {
    private String oldPassword;
    private String newPassword;
}
