package com.project.btp.service;

import com.project.btp.model.Categorie;
import com.project.btp.repository.CategorieRepository;
// import com.project.btp.service.CategorieService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieServiceImpl(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    @Override
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }
}
    

