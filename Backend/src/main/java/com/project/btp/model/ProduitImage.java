// src/main/java/com/project/btp/model/ProduitImage.java
package com.project.btp.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName; // Nom du fichier stocké (ex: uuid.png)
    private String fileType; // Type MIME (image/png, image/jpeg, etc.)

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore // ⚡ Empêche l'envoi du tableau binaire dans le JSON
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id")
    @JsonIgnore // ⚡ Évite les références circulaires
    private Produit produit;
}
