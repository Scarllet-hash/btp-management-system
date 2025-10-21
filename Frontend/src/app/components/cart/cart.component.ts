import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Ajoutez ceci
import { Observable } from 'rxjs';
import { ProductService, CartItem } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Ajoutez RouterModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.productService.cart$;
    this.cartTotal$ = this.productService.getCartTotal();
  }

  // Augmente la quantité
  increaseQuantity(productId: number, currentQuantity: number): void {
    this.productService.updateQuantity(productId, currentQuantity + 1);
  }

  // Diminue la quantité
  decreaseQuantity(productId: number, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.productService.updateQuantity(productId, currentQuantity - 1);
    }
  }

  // Retire un article du panier
  removeItem(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article ?')) {
      this.productService.removeFromCart(productId);
    }
  }

  // Vide le panier
  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.productService.clearCart();
    }
  }

  // Formatte le prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  // Calcule le sous-total d'un article
  getItemSubtotal(item: CartItem): number {
    return item.product.prix * item.quantity;
  }

  // Passe à la commande
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Retour aux achats
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}