// src/app/components/promouvoir-produits/promouvoir-produits.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promouvoir-produits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promouvoir-produits.html',
  styleUrls: ['./promouvoir-produits.scss']
})
export class PromouvoirProduitsComponent {
  
  // État des filtres de temps
  selectedTimeFilter: string = '7 jours';
  
  // Données des performances
  performanceData = {
    chiffreAffaire: '0.00',
    produitsVendus: 0,
    catalogueEnLigne: 0
  };
  
  // Données du score vendeur
  scoreVendeur = {
    tauxRetourQualite: 0,
    noteMoyenneClients: 0
  };
  
  // Méthode pour changer le filtre de temps
  selectTimeFilter(filter: string): void {
    this.selectedTimeFilter = filter;
    // Ici vous pourrez ajouter la logique pour récupérer les données selon la période
  }
  
  // Méthode pour créer des produits
  onCreateProducts(): void {
    console.log('Redirection vers la création de produits');
    // Ici vous pourrez ajouter la logique de navigation
  }
}