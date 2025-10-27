package com.project.btp.dto;
import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProduitResponseDTO {
    private Long id;
    private String nom;
    private Double prix;
    private Integer quantite;
    private String etat;
    private String description;
    private Long categorieId;
    private String categorieNom;
    private List<String> imageFileNames;
    private String message;
}
