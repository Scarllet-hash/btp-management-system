package com.project.btp.service;

import com.project.btp.model.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface UtilisateurService {
    List<Utilisateur> getAllUtilisateurs();
    Optional<Utilisateur> getUtilisateurById(Long id);
    Utilisateur createUtilisateur(Utilisateur utilisateur);
    Utilisateur updateUtilisateur(Long id, Utilisateur utilisateur);
    void deleteUtilisateur(Long id);
}
