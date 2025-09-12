package com.project.btp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    private MethodePaiement methode;

    @Enumerated(EnumType.STRING)
    private StatutPaiement statut;

    @OneToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    // Getters & Setters
}
