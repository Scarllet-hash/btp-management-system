package com.project.btp.service;

import com.project.btp.model.EntrepriseBTP;

import java.util.List;
import java.util.Optional;

public interface EntrepriseBTPService {
    List<EntrepriseBTP> getAllEntreprises();
    Optional<EntrepriseBTP> getEntrepriseById(Long id);
    EntrepriseBTP createEntreprise(EntrepriseBTP entrepriseBTP);
    EntrepriseBTP updateEntreprise(Long id, EntrepriseBTP entrepriseBTP);
    void deleteEntreprise(Long id);
}
