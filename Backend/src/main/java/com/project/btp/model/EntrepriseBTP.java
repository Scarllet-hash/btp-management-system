package com.project.btp.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

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
    private List<Produit> produits;
}
