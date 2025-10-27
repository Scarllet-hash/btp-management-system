package com.project.btp.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class EntrepriseBTP extends Utilisateur {

    private String siret;
    private String typeActivite;

    @OneToMany(mappedBy = "entrepriseBTP", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Produit> produits;
//     @OneToOne // ou @ManyToOne selon ton modèle (souvent OneToOne)
//     @JoinColumn(name = "utilisateur_id")
//     private Utilisateur utilisateur;
 }

