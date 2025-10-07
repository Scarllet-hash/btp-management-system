package com.project.btp.service;

import com.project.btp.model.Produit;
import com.project.btp.model.Categorie;
import com.project.btp.model.EntrepriseBTP;

import java.util.List;
import java.util.Optional;

public interface ProduitService {

    List<Produit> getAllProduits();

    Optional<Produit> getProduitById(Long id);

    Produit createProduit(Produit produit);

    Produit updateProduit(Long id, Produit produit);

    void deleteProduit(Long id);

    List<Produit> getProduitsByCategorie(Categorie categorie);

    List<Produit> getProduitsByEntreprise(EntrepriseBTP entrepriseBTP);

    List<Produit> getProduitsEnRupture(int seuil);
}
