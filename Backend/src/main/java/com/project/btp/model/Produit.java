package com.project.btp.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private EntrepriseBTP entrepriseBTP;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    @JsonIgnore
    private Categorie categorie;
    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProduitImage> images = new ArrayList<>();
}
