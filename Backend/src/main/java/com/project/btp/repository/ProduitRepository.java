package com.project.btp.repository;

import com.project.btp.model.Produit;
import com.project.btp.model.Categorie;
import com.project.btp.model.EntrepriseBTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    // Trouver les produits par nom
    List<Produit> findByNomContainingIgnoreCase(String nom);

    // Trouver les produits par catégorie
    List<Produit> findByCategorie(Categorie categorie);

    // Trouver les produits par entreprise
    List<Produit> findByEntrepriseBTP(EntrepriseBTP entrepriseBTP);

    // Trouver les produits selon leur état
    List<Produit> findByEtat(String etat);

    // Trouver les produits dont le prix est supérieur à une valeur donnée
    List<Produit> findByPrixGreaterThanEqual(java.math.BigDecimal prixMin);

    // Trouver les produits dont la quantité est inférieure à une valeur donnée
    List<Produit> findByQuantiteLessThan(Integer quantite);
}
