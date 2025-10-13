package com.project.btp.DTO;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProduitDTO {
    private String nom;
    private String description;
    private Integer quantite;
    private BigDecimal prix;
    private String etat;
    private Long categorieId; // id catégorie choisi
} 