package com.project.btp.controller;

import com.project.btp.DTO.ProduitDTO;
import com.project.btp.model.*;
import com.project.btp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "http://localhost:4200")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;
    // @Autowired
    // private ProduitImageRepository produitImageRepository;
    @Autowired
    private CategorieRepository categorieRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private EntrepriseBTPRepository entrepriseBTPRepository;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createProduit(
            @RequestPart("produit") ProduitDTO produitDTO,
            @RequestPart("images") List<MultipartFile> images,
            Principal principal
    ) throws Exception {
        // Récupérer l’utilisateur connecté
        Utilisateur u = utilisateurRepository.findByEmail(principal.getName()).orElseThrow();
        EntrepriseBTP entreprise = entrepriseBTPRepository.findByUtilisateur(u);

        // Créer le produit
        Produit produit = Produit.builder()
                .nom(produitDTO.getNom())
                .description(produitDTO.getDescription())
                .quantite(produitDTO.getQuantite())
                .prix(produitDTO.getPrix())
                .etat(EtatProduit.valueOf(produitDTO.getEtat()))
                .categorie(categorieRepository.findById(produitDTO.getCategorieId()).orElseThrow())
                .entrepriseBTP(entreprise)
                .build();

        // Images
        List<ProduitImage> imgList = new ArrayList<>();
        for (MultipartFile file : images) {
            ProduitImage img = ProduitImage.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .data(file.getBytes())
                    .produit(produit)
                    .build();
            imgList.add(img);
        }
        produit.setImages(imgList);

        produitRepository.save(produit);
        return ResponseEntity.ok().body("Produit ajouté avec succès!");
    }

     @GetMapping("/etats")
    public List<String> getAllEtats() {
        return Arrays.stream(EtatProduit.values())
                     .map(Enum::name)
                     .collect(Collectors.toList());
    }
}