import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CategorieService, Categorie } from '../../services/categorie.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FilterBarComponent, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Categorie[] = [];
  selectedCategoryId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  // Récupère les catégories
  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories', err);
      }
    });
  }

  // Récupère tous les produits
  loadAllProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.isLoading = false;
      }
    });
  }

  // Récupère les produits par catégorie
  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.categorieService.getProductsByCategory(categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.isLoading = false;
      }
    });
  }

  // Appelé par FilterBarComponent
  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.loadAllProducts();
    } else {
      this.loadProductsByCategory(categoryId);
    }
  }

  // Appelé par FilterBarComponent
  onSortChange(sortType: string): void {
    this.sortProducts(sortType);
  }

  // Tri en frontend
  private sortProducts(sortType: string): void {
    switch (sortType) {
      case 'price-asc':
        this.products.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        this.products.sort((a, b) => b.prix - a.prix);
        break;
      case 'name':
        this.products.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      default:
        break;
    }
  }

  // Ajoute au panier
  onAddToCart(product: Product): void {
    this.productService.addToCart(product);
    console.log('Produit ajouté au panier:', product);
  }
getCategoryTitle(categoryId: number | null): string {
    if (categoryId === null) return 'Tous nos produits';
    
    const category = this.categories.find(c => c.id === categoryId);
    return category?.nom || 'Catégorie inconnue';}
  }