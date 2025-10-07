package com.project.btp.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String motDePasse;
}