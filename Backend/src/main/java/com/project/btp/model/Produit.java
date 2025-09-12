package com.project.btp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private Integer quantite;
    private BigDecimal prix;

    @Enumerated(EnumType.STRING)
    private EtatProduit etat;

    @ManyToOne
    @JoinColumn(name = "entreprise_btp_id")
    private EntrepriseBTP entrepriseBTP;
}
