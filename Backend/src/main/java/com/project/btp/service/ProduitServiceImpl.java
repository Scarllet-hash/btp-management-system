package com.project.btp.service;

import com.project.btp.model.Produit;
import com.project.btp.model.Categorie;
import com.project.btp.model.EntrepriseBTP;
import com.project.btp.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitServiceImpl implements ProduitService {

    private final ProduitRepository produitRepository;

    public ProduitServiceImpl(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @Override
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    @Override
    public Optional<Produit> getProduitById(Long id) {
        return produitRepository.findById(id);
    }

    @Override
    public Produit createProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    @Override
    public Produit updateProduit(Long id, Produit produit) {
        return produitRepository.findById(id)
                .map(existingProduit -> {
                    existingProduit.setNom(produit.getNom());
                    existingProduit.setDescription(produit.getDescription());
                    existingProduit.setQuantite(produit.getQuantite());
                    existingProduit.setPrix(produit.getPrix());
                    existingProduit.setEtat(produit.getEtat());
                    existingProduit.setCategorie(produit.getCategorie());
                    existingProduit.setEntrepriseBTP(produit.getEntrepriseBTP());
                    return produitRepository.save(existingProduit);
                })
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID : " + id));
    }

    @Override
    public void deleteProduit(Long id) {
        produitRepository.deleteById(id);
    }

    @Override
    public List<Produit> getProduitsByCategorie(Categorie categorie) {
        return produitRepository.findByCategorie(categorie);
    }

    @Override
    public List<Produit> getProduitsByEntreprise(EntrepriseBTP entrepriseBTP) {
        return produitRepository.findByEntrepriseBTP(entrepriseBTP);
    }

    @Override
    public List<Produit> getProduitsEnRupture(int seuil) {
        return produitRepository.findByQuantiteLessThan(seuil);
    }
}
