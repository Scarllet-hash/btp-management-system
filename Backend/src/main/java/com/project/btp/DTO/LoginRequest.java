package com.project.btp.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String motDePasse;
}