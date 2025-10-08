package com.project.btp.service;

import com.project.btp.model.Categorie;
import com.project.btp.model.Produit;
import com.project.btp.repository.CategorieRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository repository;

    public CategorieServiceImpl(CategorieRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Categorie> getAllCategories() {
        return repository.findAll();
    }

    @Override
    public List<Produit> getProduitsByCategorie(Long categorieId) {
        Categorie categorie = repository.findById(categorieId)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        return categorie.getProduits();
    }
    @Override
    public Categorie createCategorie(Categorie categorie) {
        return repository.save(categorie);
    }
    
}
