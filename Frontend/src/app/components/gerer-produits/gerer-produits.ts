import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, EtatProduit } from '../../models/product';

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

  currentImageIndex: { [key: number]: number } = {};

  editingProductId: number | null = null;
  editingProduct: Product | null = null;
  etats: EtatProduit[] = ['NEUF', 'BON_ETAT', 'MAUVAIS_ETAT'];

  // Pour la gestion des images
  selectedImages: { [key: number]: (string | null)[] } = {};
  imageFiles: { [key: number]: (File | null)[] } = {};
  // NOUVEAU: Pour suivre quelles images existantes garder
  existingImageUrls: { [key: number]: (string | null)[] } = {};

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
        this.products.forEach(product => {
          this.currentImageIndex[product.id] = 0;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    switch (status) {
      case 'actif':
        this.filteredProducts = this.products.filter(p => p.etat === 'NEUF' || p.etat === 'BON_ETAT');
        break;
      case 'approuve':
        this.filteredProducts = this.products.filter(p => p.etat === 'NEUF' && p.quantite > 0);
        break;
      case 'attente':
        this.filteredProducts = this.products.filter(p => p.quantite > 0 && p.quantite < 10);
        break;
      case 'pas-pret':
        this.filteredProducts = this.products.filter(p => p.etat === 'MAUVAIS_ETAT');
        break;
      default:
        this.filteredProducts = [...this.products];
    }
  }

  isEditing(product: Product): boolean {
    return this.editingProductId === product.id;
  }

  editProduct(product: Product): void {
    this.editingProductId = product.id;
    this.editingProduct = { ...product };
    
    // Initialiser les tableaux pour 7 emplacements
    this.selectedImages[product.id] = new Array(7).fill(null);
    this.imageFiles[product.id] = new Array(7).fill(null);
    this.existingImageUrls[product.id] = new Array(7).fill(null);
    
    // Charger les images existantes
    if (product.images && product.images.length > 0) {
      product.images.forEach((url, index) => {
        if (index < 7) {
          this.selectedImages[product.id][index] = url;
          this.existingImageUrls[product.id][index] = url; // Stocker l'URL existante
        }
      });
    }
  }

  cancelEdit(): void {
    if (this.editingProductId) {
      delete this.selectedImages[this.editingProductId];
      delete this.imageFiles[this.editingProductId];
      delete this.existingImageUrls[this.editingProductId];
    }
    this.editingProductId = null;
    this.editingProduct = null;
  }

  onImageSelect(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.editingProductId) return;

    const file = input.files[0];
    
    // Validation de la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La taille de l\'image ne doit pas dépasser 2 Mo');
      return;
    }

    // Validation du type
    if (!file.type.startsWith('image/')) {
      alert('Le fichier doit être une image');
      return;
    }

    // Stocker le fichier
    this.imageFiles[this.editingProductId][index] = file;
    // Marquer que cette position a une nouvelle image (pas une existante)
    this.existingImageUrls[this.editingProductId][index] = null;

    // Créer une preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.editingProductId) {
        this.selectedImages[this.editingProductId][index] = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    if (!this.editingProductId) return;
    this.selectedImages[this.editingProductId][index] = null;
    this.imageFiles[this.editingProductId][index] = null;
    this.existingImageUrls[this.editingProductId][index] = null;
  }

  getSelectedImage(productId: number, index: number): string | null {
    return this.selectedImages[productId]?.[index] || null;
  }

  hasSelectedImage(productId: number, index: number): boolean {
    return !!this.selectedImages[productId]?.[index];
  }

  saveProduct(): void {
    if (!this.editingProduct) return;

    this.isLoading = true;
    const formData = new FormData();
    
    // Ajouter les données du produit
    const productData = {
      nom: this.editingProduct.nom,
      description: this.editingProduct.description,
      quantite: this.editingProduct.quantite,
      prix: this.editingProduct.prix,
      etat: this.editingProduct.etat
    };
    formData.append('produit', JSON.stringify(productData));

    // NOUVEAU: Collecter les URLs des images existantes à conserver
    const existingImagesToKeep: string[] = [];
    if (this.existingImageUrls[this.editingProduct.id]) {
      this.existingImageUrls[this.editingProduct.id].forEach((url) => {
        if (url) {
          existingImagesToKeep.push(url);
        }
      });
    }
    
    // Envoyer la liste des images existantes à conserver
    if (existingImagesToKeep.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImagesToKeep));
    }

    // Ajouter les nouvelles images
    if (this.imageFiles[this.editingProduct.id]) {
      this.imageFiles[this.editingProduct.id].forEach((file) => {
        if (file) {
          formData.append('images', file, file.name);
        }
      });
    }

    this.productService.updateProductFormData(this.editingProduct.id, formData).subscribe({
      next: updated => {
        console.log('Produit mis à jour:', updated);
        this.loadProducts();
        this.cancelEdit();
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur mise à jour:', err);
        this.isLoading = false;
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Supprimer "${product.nom}" ?`)) return;

    this.isLoading = true;
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        delete this.currentImageIndex[product.id];
        this.loadProducts();
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getEtatLabel(etat: EtatProduit): string {
    const labels: { [key in EtatProduit]: string } = {
      NEUF: 'Neuf',
      BON_ETAT: 'Bon état',
      MAUVAIS_ETAT: 'Mauvais état'
    };
    return labels[etat] || etat;
  }

  getEtatClass(etat: EtatProduit): string {
    const classes: { [key in EtatProduit]: string } = {
      NEUF: 'status-neuf',
      BON_ETAT: 'status-bon',
      MAUVAIS_ETAT: 'status-mauvais'
    };
    return classes[etat] || '';
  }

  getStockStatus(quantite: number): { label: string; class: string } {
    if (quantite === 0) return { label: 'Rupture', class: 'stock-rupture' };
    if (quantite < 10) return { label: 'Stock faible', class: 'stock-faible' };
    return { label: 'En stock', class: 'stock-ok' };
  }

  getCurrentImageIndex(productId: number): number {
    if (this.currentImageIndex[productId] === undefined) this.currentImageIndex[productId] = 0;
    return this.currentImageIndex[productId];
  }

  getProductImage(product: Product, index: number = 0): string {
    if (!product.images || product.images.length === 0) return '';
    const validIndex = Math.max(0, Math.min(index, product.images.length - 1));
    return product.images[validIndex];
  }

  hasMultipleImages(product: Product): boolean {
    return !!(product.images && product.images.length > 1);
  }

  getImageCount(product: Product): number {
    return product.images ? product.images.length : 0;
  }

  nextImage(product: Product, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!product.id || !product.images || product.images.length <= 1) return;
    const current = this.getCurrentImageIndex(product.id);
    this.currentImageIndex[product.id] = (current + 1) % product.images.length;
  }

  previousImage(product: Product, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!product.id || !product.images || product.images.length <= 1) return;
    const current = this.getCurrentImageIndex(product.id);
    this.currentImageIndex[product.id] = current === 0 ? product.images.length - 1 : current - 1;
  }
}