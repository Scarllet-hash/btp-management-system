package com.project.btp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

// import com.project.btp.DTO.ProduitResponseDTO;
import java.util.Optional;

import com.project.btp.dto.ProduitDTO;
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

    // Remplacez la méthode getProduit() dans votre ProduitController par celle-ci :

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<ProduitDTO> getProduit(@PathVariable Long id) {
        Optional<Produit> produitOpt = produitService.getProduitById(id);

        if (produitOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Produit p = produitOpt.get();

        // Convertir en DTO
        ProduitDTO dto = new ProduitDTO();
        dto.setId(p.getId());
        dto.setNom(p.getNom());
        dto.setDescription(p.getDescription());
        dto.setQuantite(p.getQuantite());
        dto.setPrix(p.getPrix());
        dto.setEtat(p.getEtat() != null ? p.getEtat().name() : null);
        dto.setCategorieId(p.getCategorie() != null ? p.getCategorie().getId() : null);
        dto.setEntrepriseBtpId(p.getEntrepriseBTP() != null ? p.getEntrepriseBTP().getId() : null);

        // ✅ Construire les URLs complètes des images
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            List<String> imageUrls = p.getImages().stream()
                    .map(img -> "http://localhost:8080/api/uploads/produits/" + img.getFileName())
                    .collect(Collectors.toList());
            dto.setImages(imageUrls);
        }

        System.out.println("✅ Produit " + id + " converti en DTO avec " +
                (dto.getImages() != null ? dto.getImages().size() : 0) + " images");

        return ResponseEntity.ok(dto);
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
                    .orElseThrow(() -> new RuntimeException(
                            "Catégorie non trouvée avec ID: " + produitDTO.getCategorieId()));
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

                    System.out.println("✅ Image " + (i + 1) + "/" + images.length + " sauvegardée: " + filename);
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
                    "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Erreur générale: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Erreur lors de la création du produit",
                    "message", e.getMessage()));
        }
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
            // dto.setCategorieNom(p.getCategorie() != null ? p.getCategorie().getNom() :
            // null);
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

    @PutMapping(value = "/{id:[0-9]+}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduit(
            @PathVariable Long id,
            @RequestPart("produit") String produitJson,
            @RequestPart(value = "images", required = false) MultipartFile[] newImages,
            @RequestPart(value = "existingImages", required = false) String existingImagesJson) {

        try {
            System.out.println("🛠 Mise à jour du produit ID: " + id);
            System.out.println("📦 Produit JSON: " + produitJson);
            System.out.println("📸 Nouvelles images: " + (newImages != null ? newImages.length : 0));
            System.out.println("🖼️ Images existantes JSON: " + existingImagesJson);

            // Vérifier si le produit existe
            Produit existingProduit = produitRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID: " + id));

            // Convertir le JSON en DTO
            ObjectMapper mapper = new ObjectMapper();
            ProduitDTO produitDTO = mapper.readValue(produitJson, ProduitDTO.class);

            // 🔄 Mettre à jour les champs de base
            existingProduit.setNom(produitDTO.getNom());
            existingProduit.setDescription(produitDTO.getDescription());
            existingProduit.setPrix(produitDTO.getPrix());
            existingProduit.setQuantite(produitDTO.getQuantite());

            // 🔄 Mettre à jour l'état
            if (produitDTO.getEtat() != null) {
                existingProduit.setEtat(EtatProduit.valueOf(produitDTO.getEtat()));
            }

            // 🔄 Mettre à jour la catégorie
            if (produitDTO.getCategorieId() != null) {
                Categorie categorie = categorieRepository.findById(produitDTO.getCategorieId())
                        .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
                existingProduit.setCategorie(categorie);
            }

            // 🔄 Mettre à jour l'entreprise (si précisée)
            if (produitDTO.getEntrepriseBtpId() != null) {
                EntrepriseBTP entreprise = entrepriseBTPRepository.findById(produitDTO.getEntrepriseBtpId())
                        .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));
                existingProduit.setEntrepriseBTP(entreprise);
            }

            // 📸 GESTION AMÉLIORÉE DES IMAGES
            List<ProduitImage> finalImages = new ArrayList<>();

            // 1️⃣ RÉCUPÉRER LES IMAGES EXISTANTES À CONSERVER
            if (existingImagesJson != null && !existingImagesJson.isEmpty()) {
                System.out.println("🔍 Traitement des images existantes à conserver...");

                // Parser le JSON des URLs existantes
                String[] existingUrls = mapper.readValue(existingImagesJson, String[].class);
                System.out.println("✅ Nombre d'images existantes à conserver: " + existingUrls.length);

                // Pour chaque URL existante, trouver le ProduitImage correspondant
                for (String url : existingUrls) {
                    // Extraire le nom du fichier de l'URL
                    // Format attendu: http://localhost:8080/api/uploads/produits/filename.jpg
                    String filename = url.substring(url.lastIndexOf("/") + 1);
                    System.out.println("🔎 Recherche de l'image: " + filename);

                    // Chercher cette image dans les images actuelles du produit
                    Optional<ProduitImage> existingImage = existingProduit.getImages().stream()
                            .filter(img -> img.getFileName().equals(filename))
                            .findFirst();

                    if (existingImage.isPresent()) {
                        finalImages.add(existingImage.get());
                        System.out.println("✅ Image conservée: " + filename);
                    } else {
                        System.out.println("⚠️ Image non trouvée dans la BD: " + filename);
                    }
                }
            }

            // 2️⃣ AJOUTER LES NOUVELLES IMAGES
            if (newImages != null && newImages.length > 0) {
                System.out.println("📸 Traitement de " + newImages.length + " nouvelles images");

                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                for (MultipartFile file : newImages) {
                    if (file.isEmpty()) {
                        System.out.println("⚠️ Fichier vide ignoré");
                        continue;
                    }

                    // Générer un nom unique
                    String originalFilename = file.getOriginalFilename();
                    String extension = originalFilename != null && originalFilename.contains(".")
                            ? originalFilename.substring(originalFilename.lastIndexOf("."))
                            : "";
                    String filename = UUID.randomUUID().toString() + extension;

                    // Sauvegarder le fichier
                    Path filePath = uploadPath.resolve(filename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // Créer l'entité ProduitImage
                    ProduitImage image = new ProduitImage();
                    image.setFileName(filename);
                    image.setFileType(file.getContentType());
                    image.setData(file.getBytes());
                    image.setProduit(existingProduit);

                    finalImages.add(image);
                    System.out.println("✅ Nouvelle image ajoutée: " + filename);
                }
            }

            // 3️⃣ SUPPRIMER LES IMAGES QUI NE SONT PLUS UTILISÉES
            List<String> finalFilenames = finalImages.stream()
                    .map(ProduitImage::getFileName)
                    .collect(Collectors.toList());

            for (ProduitImage oldImage : existingProduit.getImages()) {
                if (!finalFilenames.contains(oldImage.getFileName())) {
                    // Cette image a été supprimée, supprimer le fichier physique
                    try {
                        Path fileToDelete = Paths.get(UPLOAD_DIR).resolve(oldImage.getFileName());
                        Files.deleteIfExists(fileToDelete);
                        System.out.println("🗑️ Fichier supprimé: " + oldImage.getFileName());
                    } catch (IOException e) {
                        System.err.println("⚠️ Erreur suppression fichier: " + e.getMessage());
                    }
                }
            }

            // 4️⃣ METTRE À JOUR LA LISTE DES IMAGES DU PRODUIT
            existingProduit.getImages().clear();
            existingProduit.getImages().addAll(finalImages);

            System.out.println("📊 Total final d'images: " + finalImages.size());

            // 💾 Sauvegarde
            Produit updatedProduit = produitRepository.save(existingProduit);
            System.out.println("✅✅✅ Produit mis à jour avec succès : " + updatedProduit.getNom());

            // Préparer la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Produit mis à jour avec succès");
            response.put("id", updatedProduit.getId());
            response.put("nom", updatedProduit.getNom());

            // Ajouter les URLs des images dans la réponse
            if (updatedProduit.getImages() != null && !updatedProduit.getImages().isEmpty()) {
                List<String> imageUrls = updatedProduit.getImages().stream()
                        .map(img -> "http://localhost:8080/api/uploads/produits/" + img.getFileName())
                        .collect(Collectors.toList());
                response.put("images", imageUrls);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la mise à jour du produit:");
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Erreur lors de la mise à jour du produit",
                    "message", e.getMessage()));
        }
    }

}