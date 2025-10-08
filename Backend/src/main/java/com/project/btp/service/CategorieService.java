package com.project.btp.service;

import com.project.btp.model.Categorie;
import com.project.btp.model.Produit;
import java.util.List;

public interface CategorieService {
    List<Categorie> getAllCategories();
    List<Produit> getProduitsByCategorie(Long categorieId);
    Categorie createCategorie(Categorie categorie);

}
