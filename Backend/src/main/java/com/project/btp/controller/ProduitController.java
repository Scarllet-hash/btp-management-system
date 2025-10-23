package com.project.btp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.btp.DTO.ProduitDTO;
// import com.project.btp.DTO.ProduitResponseDTO;
import com.project.btp.model.Categorie;
import com.project.btp.model.EntrepriseBTP;
// import com.project.btp.model.EntrepriseBTP;
import com.project.btp.model.EtatProduit;
import com.project.btp.model.Produit;
import com.project.btp.model.ProduitImage;
import com.project.btp.repository.CategorieRepository;
import com.project.btp.repository.EntrepriseBTPRepository;
import com.project.btp.service.ProduitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.project.btp.repository.ProduitRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/produits") 
@CrossOrigin(origins = "http://localhost:4200")
public class ProduitController {
    
    @Autowired
    private ProduitService produitService;
    @Autowired
    private ProduitRepository produitRepository;
    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private EntrepriseBTPRepository entrepriseBTPRepository;

    // Dossier où stocker les images
    private final String UPLOAD_DIR = "uploads/produits/";

    @GetMapping("/etats")
    public ResponseEntity<List<String>> getEtats() {
        System.out.println("✅ Endpoint /etats appelé");
        List<String> etats = Arrays.stream(EtatProduit.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        System.out.println("États : " + etats);
        return ResponseEntity.ok(etats);
    }

  

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Produit> getProduit(@PathVariable Long id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 🔧 ENDPOINT CORRIGÉ - Retourne un DTO simple au lieu de l'entité complète
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduit(
            @RequestPart("produit") String produitJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        
        try {
            System.out.println("📦 Réception produit JSON: " + produitJson);
            if (images != null) {
                System.out.println("📸 Nombre d'images reçues: " + images.length);
            }
            
            // Parser le JSON du produit
            ObjectMapper mapper = new ObjectMapper();
            ProduitDTO produitDTO = mapper.readValue(produitJson, ProduitDTO.class);
            
            System.out.println("✅ DTO parsé - Nom: " + produitDTO.getNom());
            System.out.println("✅ Catégorie ID: " + produitDTO.getCategorieId());
            
            // Créer l'entité Produit
            Produit produit = new Produit();
            produit.setNom(produitDTO.getNom());
            produit.setPrix(produitDTO.getPrix());
            produit.setQuantite(produitDTO.getQuantite());
            produit.setDescription(produitDTO.getDescription());
            
            // Convertir l'état en enum
            try {
                produit.setEtat(EtatProduit.valueOf(produitDTO.getEtat()));
                System.out.println("✅ État défini: " + produitDTO.getEtat());
            } catch (IllegalArgumentException e) {
                System.err.println("❌ État invalide: " + produitDTO.getEtat());
                return ResponseEntity.badRequest().body("État invalide: " + produitDTO.getEtat());
            }
            
            // Associer la catégorie
            Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + produitDTO.getCategorieId()));
            produit.setCategorie(categorie);
            System.out.println("✅ Catégorie associée: " + categorie.getNom());
            
            if (produitDTO.getEntrepriseBtpId() != null) {
    EntrepriseBTP entreprise = entrepriseBTPRepository.findById(produitDTO.getEntrepriseBtpId())
        .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));
    produit.setEntrepriseBTP(entreprise);
}

            // Gérer les images
            List<ProduitImage> produitImages = new ArrayList<>();
            if (images != null && images.length > 0) {
                System.out.println("📸 Traitement de " + images.length + " images");
                
                // Créer le dossier s'il n'existe pas
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                    System.out.println("📁 Dossier créé: " + UPLOAD_DIR);
                }
                
                for (int i = 0; i < images.length; i++) {
                    MultipartFile file = images[i];
                    if (file.isEmpty()) {
                        System.out.println("⚠️ Image " + i + " vide, ignorée");
                        continue;
                    }
                    
                    // Générer un nom unique pour l'image
                    String originalFilename = file.getOriginalFilename();
                    String extension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String filename = UUID.randomUUID().toString() + extension;
                    
                    // Sauvegarder le fichier
                    Path filePath = uploadPath.resolve(filename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    
                    // Créer l'entité ProduitImage
                    ProduitImage image = new ProduitImage();
                    image.setFileName(filename);
                    image.setFileType(file.getContentType());
                    image.setData(file.getBytes()); // Optionnel si stockage en BDD
                    image.setProduit(produit);
                    
                    produitImages.add(image);
                    
                    System.out.println("✅ Image " + (i+1) + "/" + images.length + " sauvegardée: " + filename);
                }
            } else {
                System.out.println("ℹ️ Aucune image fournie");
            }
            
            produit.setImages(produitImages);
            
            // Sauvegarder le produit (cascade sauvegarde les images)
            Produit savedProduit = produitService.createProduit(produit);
            
            System.out.println("✅✅✅ Produit créé avec succès - ID: " + savedProduit.getId());
            
            // ✅ SOLUTION : Retourner un objet simple sans références circulaires
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedProduit.getId());
            response.put("nom", savedProduit.getNom());
            response.put("prix", savedProduit.getPrix());
            response.put("quantite", savedProduit.getQuantite());
            response.put("etat", savedProduit.getEtat().name());
            response.put("description", savedProduit.getDescription());
            response.put("message", "Produit créé avec succès");
            
            // Ajouter les infos de la catégorie sans référence circulaire
            if (savedProduit.getCategorie() != null) {
                Map<String, Object> categorieInfo = new HashMap<>();
                categorieInfo.put("id", savedProduit.getCategorie().getId());
                categorieInfo.put("nom", savedProduit.getCategorie().getNom());
                response.put("categorie", categorieInfo);
            }
            
            // Ajouter les noms de fichiers des images (pas les objets complets)
            if (savedProduit.getImages() != null && !savedProduit.getImages().isEmpty()) {
                List<String> imageNames = savedProduit.getImages().stream()
                        .map(ProduitImage::getFileName)
                        .collect(Collectors.toList());
                response.put("images", imageNames);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            System.err.println("❌ Erreur I/O: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erreur lors de la sauvegarde des fichiers",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            System.err.println("❌ Erreur générale: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erreur lors de la création du produit",
                "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        Produit updated = produitService.updateProduit(id, produit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }
@GetMapping
public List<ProduitDTO> getAllProduits() {
    List<Produit> produits = produitRepository.findAll();
    List<ProduitDTO> dtos = new ArrayList<>();

    for (Produit p : produits) {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(p.getId());
        dto.setNom(p.getNom());
        dto.setDescription(p.getDescription());
        dto.setQuantite(p.getQuantite());
        dto.setPrix(p.getPrix());
        dto.setEtat(p.getEtat() != null ? p.getEtat().name() : null);
        dto.setCategorieId(p.getCategorie() != null ? p.getCategorie().getId() : null);
        // dto.setCategorieNom(p.getCategorie() != null ? p.getCategorie().getNom() : null);
        dto.setEntrepriseBtpId(p.getEntrepriseBTP() != null ? p.getEntrepriseBTP().getId() : null);
        
        // ✅ URLs complètes des images
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            List<String> imageUrls = p.getImages().stream()
                    .map(img -> "http://localhost:8080/api/uploads/produits/" + img.getFileName())
                    .collect(Collectors.toList());
            dto.setImages(imageUrls);
        }
        
        dtos.add(dto);
    }

    return dtos;
}


}