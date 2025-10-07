package com.project.btp.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class EntrepriseRecyclage extends Utilisateur {

    private String licence;
    private Integer capaciteTraitement;
}
