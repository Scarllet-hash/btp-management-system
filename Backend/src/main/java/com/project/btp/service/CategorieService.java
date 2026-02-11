package com.project.btp.service;

import com.project.btp.dto.ProduitDTO;
import com.project.btp.model.Categorie;
import com.project.btp.model.Produit;

import java.util.List;

public interface CategorieService {
    List<Categorie> getAllCategories();
    List<ProduitDTO> getProduitsByCategorie(Long categorieId);

}