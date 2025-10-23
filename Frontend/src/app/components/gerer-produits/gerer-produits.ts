// src/app/gerer-produits/gerer-produits.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-gerer-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerer-produits.html',
  styleUrls: ['./gerer-produits.scss']
})
export class GererProduitsComponent implements OnInit {
  selectedStatus: string = 'tous';
  isLoading: boolean = false;
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Gestion de la navigation des images
  currentImageIndex: { [key: number]: number } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        // Initialiser les index d'images à 0 pour tous les produits
        this.products.forEach(product => {
          if (product.id) {
            this.currentImageIndex[product.id] = 0;
          }
        });
        this.isLoading = false;
        console.log('✅ Produits chargés:', this.products);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des produits:', err);
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    
    if (status === 'tous') {
      this.filteredProducts = [...this.products];
    } else {
      switch (status) {
        case 'actif':
          this.filteredProducts = this.products.filter(p => 
            p.etat === 'NEUF' || p.etat === 'BON_ETAT'
          );
          break;
        case 'approuve':
          this.filteredProducts = this.products.filter(p => 
            p.etat === 'NEUF' && p.quantite > 0
          );
          break;
        case 'attente':
          this.filteredProducts = this.products.filter(p => 
            p.quantite > 0 && p.quantite < 10
          );
          break;
        case 'pas-pret':
          this.filteredProducts = this.products.filter(p => 
            p.etat === 'MAUVAIS_ETAT'
          );
          break;
        default:
          this.filteredProducts = [...this.products];
      }
    }
    console.log(`Filtrage par ${status}: ${this.filteredProducts.length} produits`);
  }

  editProduct(product: Product): void {
    console.log('Modifier le produit:', product);
  }

  viewProduct(product: Product): void {
    console.log('Voir le produit:', product);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.nom}" ?`)) {
      this.isLoading = true;
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          console.log('✅ Produit supprimé avec succès');
          // Nettoyer l'index d'image du produit supprimé
          if (product.id) {
            delete this.currentImageIndex[product.id];
          }
          this.loadProducts();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression du produit:', err);
          alert('Erreur lors de la suppression du produit');
          this.isLoading = false;
        }
      });
    }
  }

  updateProduct(product: Product): void {
    const newQuantite = prompt(`Modifier la quantité pour "${product.nom}":`, product.quantite.toString());
    
    if (newQuantite !== null && !isNaN(Number(newQuantite))) {
      const updatedProduct: Product = {
        ...product,
        quantite: Number(newQuantite)
      };
      
      this.isLoading = true;
      this.productService.updateProduct(product.id!, updatedProduct).subscribe({
        next: (updated) => {
          console.log('✅ Produit mis à jour avec succès', updated);
          this.loadProducts();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour du produit:', err);
          alert('Erreur lors de la mise à jour du produit');
          this.isLoading = false;
        }
      });
    }
  }

  getEtatLabel(etat: string): string {
    const etatLabels: { [key: string]: string } = {
      'NEUF': 'Neuf',
      'BON_ETAT': 'Bon état',
      'USE': 'Usé',
      'MAUVAIS_ETAT': 'Mauvais état',
      'HORS_SERVICE': 'Hors service'
    };
    return etatLabels[etat] || etat;
  }

  getEtatClass(etat: string): string {
    const etatClasses: { [key: string]: string } = {
      'NEUF': 'status-neuf',
      'BON_ETAT': 'status-bon',
      'USE': 'status-use',
      'MAUVAIS_ETAT': 'status-mauvais',
      'HORS_SERVICE': 'status-hors-service'
    };
    return etatClasses[etat] || '';
  }

  getStockStatus(quantite: number): { label: string, class: string } {
    if (quantite === 0) {
      return { label: 'Rupture', class: 'stock-rupture' };
    } else if (quantite < 10) {
      return { label: 'Stock faible', class: 'stock-faible' };
    } else {
      return { label: 'En stock', class: 'stock-ok' };
    }
  }

  // Méthodes pour la gestion des images
  getProductImage(product: Product, index: number = 0): string {
    // Vérifier que le produit a des images
    if (!product.images || product.images.length === 0) {
      return ''; // Ou retourner une image par défaut
    }
    
    // S'assurer que l'index est valide
    const validIndex = Math.max(0, Math.min(index, product.images.length - 1));
    
    // Retourner l'image à l'index valide
    return product.images[validIndex] || '';
  }

  getCurrentImageIndex(productId: number): number {
    // Vérifier si l'index existe, sinon initialiser à 0
    if (this.currentImageIndex[productId] === undefined) {
      this.currentImageIndex[productId] = 0;
    }
    return this.currentImageIndex[productId];
  }

  nextImage(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault(); // Empêcher tout comportement par défaut
    
    if (!product.id || !product.images || product.images.length <= 1) {
      return;
    }
    
    const currentIndex = this.getCurrentImageIndex(product.id);
    const nextIndex = (currentIndex + 1) % product.images.length;
    
    this.currentImageIndex[product.id] = nextIndex;
    
    console.log(`Produit ${product.id}: Image ${currentIndex} -> ${nextIndex}`);
  }

  previousImage(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault(); // Empêcher tout comportement par défaut
    
    if (!product.id || !product.images || product.images.length <= 1) {
      return;
    }
    
    const currentIndex = this.getCurrentImageIndex(product.id);
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    
    this.currentImageIndex[product.id] = prevIndex;
    
    console.log(`Produit ${product.id}: Image ${currentIndex} -> ${prevIndex}`);
  }

  hasMultipleImages(product: Product): boolean {
    return !!(product.images && product.images.length > 1);
  }

  getImageCount(product: Product): number {
    return product.images ? product.images.length : 0;
  }
}