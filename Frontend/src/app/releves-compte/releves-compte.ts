// src/app/components/releves-compte/releves-compte.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExportForm {
  dateDebut: string;
  dateFin: string;
  payeChecked: boolean;
  nonPayeChecked: boolean;
}

interface Tab {
  key: string;
  label: string;
}

@Component({
  selector: 'app-releves-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './releves-compte.html',
  styleUrl: './releves-compte.scss'
})
export class RelevesCompteComponent {
  
  // État des onglets
  activeTab: string = 'apercu';
  
  tabs: Tab[] = [
    { key: 'apercu', label: 'APERÇU' },
    { key: 'en-cours', label: 'EN COURS' },
    { key: 'paye', label: 'PAYÉ' }
  ];
  
  // État du modal d'exportation
  showExportModal: boolean = false;
  
  // Formulaire d'exportation
  exportForm: ExportForm = {
    dateDebut: '',
    dateFin: '',
    payeChecked: false,
    nonPayeChecked: false
  };
  
  // Méthodes pour les onglets
  setActiveTab(tabKey: string): void {
    this.activeTab = tabKey;
  }
  
  // Méthodes pour le modal d'exportation
  openExportModal(): void {
    this.showExportModal = true;
    // Réinitialiser le formulaire
    this.exportForm = {
      dateDebut: '',
      dateFin: '',
      payeChecked: false,
      nonPayeChecked: false
    };
  }
  
  closeExportModal(): void {
    this.showExportModal = false;
  }
  
  exportTransactions(): void {
    // Validation basique
    if (!this.exportForm.dateDebut || !this.exportForm.dateFin || 
        (!this.exportForm.payeChecked && !this.exportForm.nonPayeChecked)) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner au moins un statut de paiement');
      return;
    }
    
    // Vérification que la date de début est antérieure à la date de fin
    if (new Date(this.exportForm.dateDebut) > new Date(this.exportForm.dateFin)) {
      alert('La date de début doit être antérieure à la date de fin');
      return;
    }
    
    // Vérification de la plage de 6 mois
    const dateDebut = new Date(this.exportForm.dateDebut);
    const dateFin = new Date(this.exportForm.dateFin);
    const diffMonths = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 + 
                      (dateFin.getMonth() - dateDebut.getMonth());
    
    if (diffMonths > 6) {
      alert('La plage de dates ne peut pas dépasser 6 mois');
      return;
    }
    
    // Construire les statuts sélectionnés
    const statutsSelectionnes = [];
    if (this.exportForm.payeChecked) statutsSelectionnes.push('payé');
    if (this.exportForm.nonPayeChecked) statutsSelectionnes.push('non payé');
    
    // Logique d'exportation
    console.log('Exportation des transactions:', {
      ...this.exportForm,
      statutsSelectionnes
    });
    
    // Simulation de l'exportation
    alert('Exportation lancée ! Vous recevrez un email une fois le fichier prêt.');
    
    // Fermer le modal
    this.closeExportModal();
  }
}