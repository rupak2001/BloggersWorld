package com.bloggersworld.BWBackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResendVerificationRequest {
    private String email;
}
