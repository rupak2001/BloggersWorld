package com.bloggersworld.BWBackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EditRequest {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String dp;
}
