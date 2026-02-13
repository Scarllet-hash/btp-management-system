import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnChanges {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  isAddingToCart: boolean = false;
  currentImageIndex: number = 0;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.currentImageIndex = 0;
    }
  }

  viewDetails(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.isAddingToCart = true;
    this.addToCart.emit(this.product);

    setTimeout(() => {
      this.isAddingToCart = false;
    }, 1000);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  showNextImage(event: Event): void {
    event.stopPropagation();
    if (!this.product.images || this.product.images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  showPrevImage(event: Event): void {
    event.stopPropagation();
    if (!this.product.images || this.product.images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  setImage(index: number, event: Event): void {
    event.stopPropagation();
    this.currentImageIndex = index;
  }
}
