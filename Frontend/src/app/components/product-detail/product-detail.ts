import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading: boolean = true;
  currentImageIndex: number = 0;
  isAddingToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        console.log('Produit chargé:', data);
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit', err);
        this.isLoading = false;
        alert('Erreur lors du chargement du produit');
        this.router.navigate(['/products']);
      }
    });
  }

  nextImage(): void {
    if (this.product && this.product.images && this.product.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  previousImage(): void {
    if (this.product && this.product.images && this.product.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.product.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    if (this.product && this.product.images && this.product.images.length > 0) {
      return this.product.images[this.currentImageIndex];
    }
    return '';
  }

  addToCart(): void {
    if (this.product) {
      this.isAddingToCart = true;
      this.productService.addToCart(this.product);
      
      setTimeout(() => {
        this.isAddingToCart = false;
        alert('Produit ajouté au panier avec succès !');
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  getEtatLabel(etat: string): string {
    const labels: { [key: string]: string } = {
      'NEUF': 'Neuf',
      'BON_ETAT': 'Bon état',
      'MAUVAIS_ETAT': 'Mauvais état'
    };
    return labels[etat] || etat;
  }

  getStockStatus(): { label: string; class: string } {
    if (!this.product) return { label: '', class: '' };
    
    if (this.product.quantite === 0) {
      return { label: 'Rupture de stock', class: 'stock-rupture' };
    } else if (this.product.quantite < 10) {
      return { label: 'Stock limité', class: 'stock-limite' };
    } else {
      return { label: 'En stock', class: 'stock-disponible' };
    }
  }
}