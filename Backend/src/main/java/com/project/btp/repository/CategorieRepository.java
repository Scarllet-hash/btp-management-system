package com.project.btp.repository;

import com.project.btp.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    // tu peux ajouter des méthodes custom si besoin
}
