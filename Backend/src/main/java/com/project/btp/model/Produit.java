package com.project.btp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
// @Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "entrepriseBTP", "categorie", "images" })
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Size(min = 1, max = 100)
    private String nom;
    @Size(max = 500)
    private String description;
    @NotNull
    @Min(0)
    private Integer quantite;
    @NotNull
    @Positive
    private BigDecimal prix;

    @Enumerated(EnumType.STRING)
    private EtatProduit etat;

    @ManyToOne
    @JoinColumn(name = "entreprise_btp_id")
    @JsonBackReference
    private EntrepriseBTP entrepriseBTP;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    @JsonBackReference
    private Categorie categorie;
    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<ProduitImage> images = new ArrayList<>();

    public void addImage(ProduitImage image) {
        images.add(image); // ajoute l'image à la liste du produit
        image.setProduit(this); // met à jour la référence produit dans ProduitImage
    }

    public void removeImage(ProduitImage image) {
        images.remove(image); // supprime l'image de la liste
        image.setProduit(null); // supprime la référence produit dans ProduitImage
    }

}
