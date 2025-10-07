package com.project.btp.service;

import com.project.btp.model.EntrepriseBTP;
import com.project.btp.repository.EntrepriseBTPRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseBTPServiceImpl implements EntrepriseBTPService {

    private final EntrepriseBTPRepository entrepriseBTPRepository;

    public EntrepriseBTPServiceImpl(EntrepriseBTPRepository entrepriseBTPRepository) {
        this.entrepriseBTPRepository = entrepriseBTPRepository;
    }

    @Override
    public List<EntrepriseBTP> getAllEntreprises() {
        return entrepriseBTPRepository.findAll();
    }

    @Override
    public Optional<EntrepriseBTP> getEntrepriseById(Long id) {
        return entrepriseBTPRepository.findById(id);
    }

    @Override
    public EntrepriseBTP createEntreprise(EntrepriseBTP entrepriseBTP) {
        return entrepriseBTPRepository.save(entrepriseBTP);
    }

    @Override
    public EntrepriseBTP updateEntreprise(Long id, EntrepriseBTP entrepriseBTP) {
        return entrepriseBTPRepository.findById(id)
                .map(existing -> {
                    existing.setNom(entrepriseBTP.getNom());
                    existing.setEmail(entrepriseBTP.getEmail());
                    existing.setTelephone(entrepriseBTP.getTelephone());
                    existing.setMotDePasse(entrepriseBTP.getMotDePasse());
                    existing.setSiret(entrepriseBTP.getSiret());
                    existing.setTypeActivite(entrepriseBTP.getTypeActivite());
                    return entrepriseBTPRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Entreprise BTP non trouvée"));
    }

    @Override
    public void deleteEntreprise(Long id) {
        entrepriseBTPRepository.deleteById(id);
    }
}
