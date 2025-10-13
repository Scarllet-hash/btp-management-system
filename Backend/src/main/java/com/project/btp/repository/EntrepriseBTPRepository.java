package com.project.btp.repository;

import com.project.btp.model.EntrepriseBTP;
import com.project.btp.model.Utilisateur;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrepriseBTPRepository extends JpaRepository<EntrepriseBTP, Long> {

    EntrepriseBTP findByUtilisateur(Utilisateur u);
}
