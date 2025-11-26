package com.project.btp.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// ⚡ Exclut la liste de produits pour éviter boucle infinie avec Lombok toString
@ToString(exclude = "produits")
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ⚡ Validation pour s'assurer que le nom n'est jamais vide
    @NotBlank
    private String nom;

    private String description;

    // ⚡ Assure que la liste n'est jamais null avec Lombok Builder
    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<Produit> produits = new ArrayList<>();

    // ============================================
    // ⚡ Méthodes pour gérer la relation bidirectionnelle Produit ↔ Categorie
    // Maintiennent la cohérence côté Produit lors de l'ajout ou suppression
    // ============================================
    public void addProduit(Produit produit) {
        produits.add(produit);        // ajoute le produit à la liste
        produit.setCategorie(this);   // met à jour la référence catégorie dans le produit
    }

    public void removeProduit(Produit produit) {
        produits.remove(produit);     // retire le produit de la liste
        produit.setCategorie(null);   // supprime la référence catégorie dans le produit
    }
}
