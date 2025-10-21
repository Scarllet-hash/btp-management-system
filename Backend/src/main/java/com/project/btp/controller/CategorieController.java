package com.project.btp.controller;

import com.project.btp.model.Categorie;
import com.project.btp.model.Produit;
import com.project.btp.service.CategorieService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategorieController {

    private final CategorieService service;

    public CategorieController(CategorieService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categorie> getAllCategories() {
        return service.getAllCategories();
    }
     @GetMapping("/{id}/produits")
    public List<Produit> getProduitsByCategorie(@PathVariable Long id) {
        return service.getProduitsByCategorie(id);
    }
}