package com.project.btp.service;

import com.project.btp.dto.ProduitDTO;
import com.project.btp.model.Categorie;
import com.project.btp.model.Produit;
import com.project.btp.repository.CategorieRepository;
import com.project.btp.repository.ProduitRepository;
// import com.project.btp.service.CategorieService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;
 public CategorieServiceImpl(CategorieRepository categorieRepository,
                            ProduitRepository produitRepository) {
    this.categorieRepository = categorieRepository;
    this.produitRepository = produitRepository;
}


    @Override
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }
    @Override
    public List<ProduitDTO> getProduitsByCategorie(Long categorieId) {
    List<Produit> produits = produitRepository.findByCategorie_Id(categorieId);

    return produits.stream().map(p -> {

        ProduitDTO dto = new ProduitDTO();
        dto.setId(p.getId());
        dto.setNom(p.getNom());
        dto.setDescription(p.getDescription());
        dto.setQuantite(p.getQuantite());
        dto.setPrix(p.getPrix());
        dto.setEtat(p.getEtat() != null ? p.getEtat().name() : null);

        dto.setCategorieId(p.getCategorie() != null ? p.getCategorie().getId() : null);
        dto.setEntrepriseBtpId(p.getEntrepriseBTP() != null ? p.getEntrepriseBTP().getId() : null);

        // ✅ Convert ProduitImage -> URL String
        List<String> urls = p.getImages().stream()
                .map(img -> "http://localhost:8080/api/uploads/produits/" + img.getFileName())
                .toList();

        dto.setImages(urls);

        return dto;

    }).toList();
}}