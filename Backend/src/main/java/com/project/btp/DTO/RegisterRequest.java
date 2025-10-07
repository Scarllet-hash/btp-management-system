package com.project.btp.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String type; // "Personne", "Entreprise BTP", "Entreprise de recyclage"
    // Champs communs
    private String email;
    private String motDePasse;
    private String nom;
    private String telephone;
    // EntrepriseBTP
    private String siret;
    private String typeActivite;
    // EntrepriseRecyclage
    private String licence;
    private Integer capaciteTraitement;
}