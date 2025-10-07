import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.cartItems$ = this.productService.getCart();
    this.cartTotal$ = this.productService.getCartTotal();
  }

  ngOnInit(): void {
    // Optionnel: Charger les données du panier au démarrage
  }

  updateQuantity(productId: number, quantity: number): void {
    this.productService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.productService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      this.productService.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    // Solution 1: Navigation vers la page d'accueil (qui redirige vers /products)
    this.router.navigate(['/']);
    
    // Ou Solution 2: Navigation directe vers /products
    // this.router.navigate(['/products']);
    
    // Ou Solution 3: Si vous voulez forcer un rechargement complet
    // window.location.href = '/products';
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  calculateItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  onQuantityChange(event: Event, productId: number): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value);
    
    if (quantity > 0) {
      this.updateQuantity(productId, quantity);
    }
  }
}