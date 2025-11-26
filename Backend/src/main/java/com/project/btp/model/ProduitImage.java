package com.project.btp.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "produit") // empêche boucle infinie
public class ProduitImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fileName; // Nom du fichier stocké (ex: uuid.png)

    @NotBlank
    private String fileType; // Type MIME (image/png, image/jpeg, etc.)

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore // Empêche l'envoi du tableau binaire dans le JSON
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "produit_id")
    @JsonBackReference
    private Produit produit;

    // ===============================
    // Méthodes utilitaires pour gérer la relation bidirectionnelle
    // ===============================
    public void setProduit(Produit produit) {
        this.produit = produit;
    }
}
