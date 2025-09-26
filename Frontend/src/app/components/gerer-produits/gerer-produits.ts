// src/app/gerer-produits/gerer-produits.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  nom: string;
  prix: number;
  prixVente: number;
  quantite: number;
  dateCreation: string;
  visible: boolean;
  actif: boolean;
}

@Component({
  selector: 'app-gerer-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerer-produits.html',
  styleUrls: ['./gerer-produits.scss']
})
export class GererProduitsComponent {
  selectedStatus: string = 'tous';
  
  products: Product[] = [
    {
      id: 1,
      nom: 'Smartphone Galaxy Pro',
      prix: 699.99,
      prixVente: 799.99,
      quantite: 25,
      dateCreation: '2024-01-15',
      visible: true,
      actif: true
    },
    {
      id: 2,
      nom: 'Casque Bluetooth Premium',
      prix: 129.99,
      prixVente: 159.99,
      quantite: 50,
      dateCreation: '2024-01-20',
      visible: true,
      actif: false
    },
    {
      id: 3,
      nom: 'Montre Connectée Sport',
      prix: 249.99,
      prixVente: 299.99,
      quantite: 0,
      dateCreation: '2024-02-01',
      visible: false,
      actif: true
    }
  ];

  filteredProducts: Product[] = [...this.products];

  filterByStatus(status: string) {
    this.selectedStatus = status;
    
    if (status === 'tous') {
      this.filteredProducts = [...this.products];
    } else {
      // Logique de filtrage basée sur le statut
      switch (status) {
        case 'actif':
          this.filteredProducts = this.products.filter(p => p.actif);
          break;
        case 'inactif':
          this.filteredProducts = this.products.filter(p => !p.actif);
          break;
        case 'approuve':
          this.filteredProducts = this.products.filter(p => p.visible && p.actif);
          break;
        case 'attente':
        case 'pas-pret':
        case 'rejete':
          this.filteredProducts = this.products.filter(p => !p.actif || !p.visible);
          break;
        default:
          this.filteredProducts = [...this.products];
      }
    }
  }

  editProduct(product: Product) {
    console.log('Modifier le produit:', product);
    // Logique de modification
  }

  viewProduct(product: Product) {
    console.log('Voir le produit:', product);
    // Logique de visualisation
  }
}