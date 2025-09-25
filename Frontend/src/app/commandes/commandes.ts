// src/app/components/commandes/commandes.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes.html',
  styleUrls: ['./commandes.scss']
})
export class CommandesComponent {
  
  // Filtres
  selectedStatus: string = 'Tous';
  searchQuery: string = '';
  itemsPerPage: number = 20;
  
  // Statuts disponibles (sans expédié et prêt à expédier)
  statusOptions = [
    'Tous', 'En attente', 'Livré', 'Annulé', 'La livraison a échoué', 'Retourné'
  ];
  
  // Mapping des statuts français vers anglais pour le breadcrumb
  statusMapping: { [key: string]: string } = {
    'Tous': 'All',
    'En attente': 'Pending',
    'Livré': 'Delivered',
    'Annulé': 'Cancelled',
    'La livraison a échoué': 'Delivery Failed',
    'Retourné': 'Returned'
  };
  
  // Données des commandes (vide pour l'instant)
  orders: any[] = [];
  
  // État de la pagination
  currentPage: number = 0;
  totalOrders: number = 0;
  
  // Méthode pour obtenir le texte du breadcrumb
  getBreadcrumbText(): string {
    return this.statusMapping[this.selectedStatus] || 'All';
  }
  
  // Actions
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    // Logique de filtrage
    console.log('Statut sélectionné:', status);
    console.log('Breadcrumb affiché:', this.getBreadcrumbText());
  }
  
  onSearch(): void {
    // Logique de recherche
    console.log('Recherche:', this.searchQuery);
  }
  
  onExport(): void {
    // Logique d'export
    console.log('Export des commandes');
  }
}