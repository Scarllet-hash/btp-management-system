package com.project.btp.controller;

import com.project.btp.DTO.LoginRequest;
import com.project.btp.DTO.RegisterRequest;
import com.project.btp.model.*;
import com.project.btp.repository.*;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final EntrepriseBTPRepository entrepriseBTPRepository;
    private final EntrepriseRecyclageRepository entrepriseRecyclageRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
        UtilisateurRepository utilisateurRepository,
        EntrepriseBTPRepository entrepriseBTPRepository,
        EntrepriseRecyclageRepository entrepriseRecyclageRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.entrepriseBTPRepository = entrepriseBTPRepository;
        this.entrepriseRecyclageRepository = entrepriseRecyclageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Email déjà utilisé ?
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé !");
        }

        // Hash du mot de passe
        String hashedPassword = passwordEncoder.encode(request.getMotDePasse());

        switch (request.getType()) {
            case "Personne":
                Utilisateur user = Utilisateur.builder()
                    .email(request.getEmail())
                    .motDePasse(hashedPassword)
                    .nom(request.getNom())
                    .telephone(request.getTelephone())
                    .build();
                utilisateurRepository.save(user);
                break;
            case "Entreprise BTP":
                EntrepriseBTP btp = EntrepriseBTP.builder()
                    .email(request.getEmail())
                    .motDePasse(hashedPassword)
                    .nom(request.getNom())
                    .telephone(request.getTelephone())
                    .siret(request.getSiret())
                    .typeActivite(request.getTypeActivite())
                    .build();
                entrepriseBTPRepository.save(btp);
                break;
            case "Entreprise de recyclage":
                EntrepriseRecyclage recyc = EntrepriseRecyclage.builder()
                    .email(request.getEmail())
                    .motDePasse(hashedPassword)
                    .nom(request.getNom())
                    .telephone(request.getTelephone())
                    .licence(request.getLicence())
                    .capaciteTraitement(request.getCapaciteTraitement())
                    .build();
                entrepriseRecyclageRepository.save(recyc);
                break;
            default:
                return ResponseEntity.badRequest().body("Type non reconnu !");
        }
        return ResponseEntity.ok(Map.of("message", "Inscription réussie !"));
    }
  @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    Utilisateur user = utilisateurRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null) {
        return ResponseEntity.status(401).body(Map.of("message", "Email introuvable !"));
    }
    if (!passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse())) {
        return ResponseEntity.status(401).body(Map.of("message", "Mot de passe incorrect !"));
    }
    return ResponseEntity.ok(Map.of("message", "Connexion réussie !"));
}
}