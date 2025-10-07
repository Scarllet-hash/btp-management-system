import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FilterBarComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  isLoading: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  getCategoryTitle(category: string): string {
  const categoryTitles: { [key: string]: string } = {
    'ciment': 'Ciments et Mortiers',
    'outils': 'Outils et Équipements',
    'isolation': 'Isolation et Étanchéité',
    'plomberie': 'Plomberie et Sanitaires',
    'all': 'Tous nos produits'
  };
  
  return categoryTitles[category] || category;
}
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.isLoading = false;
      }
    });
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  onSortChanged(sortType: string): void {
    this.sortProducts(sortType);
  }

  onAddToCart(product: Product): void {
    this.productService.addToCart(product);
    console.log('Produit ajouté au panier:', product);
  }

  private filterProducts(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        product => product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
  }

  private sortProducts(sortType: string): void {
    switch (sortType) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
  }
}