package com.project.btp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
// ⚡ @Data génère equals/hashCode/toString → risque de boucle infinie avec les relations bidirectionnelles
// On peut remplacer par @Getter @Setter et @ToString(exclude = {...}) pour plus de sécurité si besoin
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String email;

    private String telephone;

    private String motDePasse;

    // ⚡ Assure que la liste d'annonces n'est jamais null et permet la cohérence bidirectionnelle
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL)
    @JsonManagedReference
    @Builder.Default
    private List<Annonce> annonces = new ArrayList<>();

    // ⚡ Assure que la liste de commandes n'est jamais null et permet la cohérence bidirectionnelle
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL)
    @JsonManagedReference
    @Builder.Default
    private List<Commande> commandes = new ArrayList<>();

    // ============================================
    // ⚡ Méthodes pour gérer la relation bidirectionnelle Utilisateur ↔ Annonce
    // ============================================
    public void addAnnonce(Annonce annonce) {
        annonces.add(annonce);          // ajoute l'annonce à la liste
        annonce.setUtilisateur(this);   // met à jour la référence utilisateur dans Annonce
    }

    public void removeAnnonce(Annonce annonce) {
        annonces.remove(annonce);       // supprime l'annonce de la liste
        annonce.setUtilisateur(null);   // supprime la référence utilisateur dans Annonce
    }

    // ============================================
    // ⚡ Méthodes pour gérer la relation bidirectionnelle Utilisateur ↔ Commande
    // ============================================
    public void addCommande(Commande commande) {
        commandes.add(commande);        // ajoute la commande à la liste
        commande.setUtilisateur(this);  // met à jour la référence utilisateur dans Commande
    }

    public void removeCommande(Commande commande) {
        commandes.remove(commande);     // supprime la commande de la liste
        commande.setUtilisateur(null);  // supprime la référence utilisateur dans Commande
    }
}
