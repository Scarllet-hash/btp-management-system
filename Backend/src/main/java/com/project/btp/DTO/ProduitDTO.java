package com.project.btp.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProduitDTO {
    private Long id; // ✅ Ajout de l'ID
    private String nom;
    private String description;
    private Integer quantite;
    private BigDecimal prix;
    private String etat;
    private Long categorieId; // id catégorie choisi
    // private String categorieNom; // ✅ Utile pour l'affichage
    private Long entrepriseBtpId;
    private List<String> images = new ArrayList<>();
}