package com.project.btp.controller;

import com.project.btp.model.EntrepriseBTP;
import com.project.btp.service.EntrepriseBTPService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entreprisesBTP")
@CrossOrigin(origins = "*")
public class EntrepriseBTPController {

    private final EntrepriseBTPService entrepriseBTPService;

    public EntrepriseBTPController(EntrepriseBTPService entrepriseBTPService) {
        this.entrepriseBTPService = entrepriseBTPService;
    }

    // GET toutes les entreprises
    @GetMapping
    public List<EntrepriseBTP> getAllEntreprises() {
        return entrepriseBTPService.getAllEntreprises();
    }

    // GET entreprise par ID
    @GetMapping("/{id}")
    public ResponseEntity<EntrepriseBTP> getEntrepriseById(@PathVariable Long id) {
        return entrepriseBTPService.getEntrepriseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST créer une entreprise
    @PostMapping
    public EntrepriseBTP createEntreprise(@RequestBody EntrepriseBTP entrepriseBTP) {
        return entrepriseBTPService.createEntreprise(entrepriseBTP);
    }

    // PUT mettre à jour une entreprise
    @PutMapping("/{id}")
    public EntrepriseBTP updateEntreprise(@PathVariable Long id, @RequestBody EntrepriseBTP entrepriseBTP) {
        return entrepriseBTPService.updateEntreprise(id, entrepriseBTP);
    }

    // DELETE une entreprise
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        entrepriseBTPService.deleteEntreprise(id);
        return ResponseEntity.noContent().build();
    }
}
