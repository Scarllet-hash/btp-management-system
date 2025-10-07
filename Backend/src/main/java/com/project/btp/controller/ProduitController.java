package com.project.btp.controller;

import com.project.btp.model.Produit;
import com.project.btp.service.ProduitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produits") // ⚠️ plus besoin de /api ici, déjà ajouté par context-path
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    // 🔹 GET - Tous les produits
    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    // 🔹 GET - Produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 POST - Ajouter un produit
    @PostMapping
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) {
        Produit saved = produitService.createProduit(produit);
        return ResponseEntity.ok(saved);
    }

    // 🔹 PUT - Modifier un produit
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        Produit updated = produitService.updateProduit(id, produit);
        return ResponseEntity.ok(updated);
    }

    // 🔹 DELETE - Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 GET - Produits en rupture de stock
    @GetMapping("/rupture/{seuil}")
    public List<Produit> getProduitsEnRupture(@PathVariable int seuil) {
        return produitService.getProduitsEnRupture(seuil);
    }
}
