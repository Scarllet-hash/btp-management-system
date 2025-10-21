import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api'; // ✅ URL de base
  
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }
  getEtats() {
  return this.http.get<string[]>('http://localhost:8080/api/produits/etats');
}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produits`); // ✅ Changé de /products à /produits
  }

  addToCart(product: Product): void {
    const currentCart = this.cartItems.value;
    const existingItemIndex = currentCart.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        product: product,
        quantity: 1
      });
    }

    this.cartItems.next([...currentCart]);
    this.saveCartToStorage();
    
    console.log('Panier mis à jour:', currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value.filter(
      item => item.product.id !== productId
    );
    this.cartItems.next(currentCart);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const itemIndex = currentCart.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        currentCart.splice(itemIndex, 1);
      } else {
        currentCart[itemIndex].quantity = quantity;
      }
      this.cartItems.next([...currentCart]);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCart(): CartItem[] {
    return this.cartItems.value;
  }

  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map((cart: CartItem[]) => cart.reduce(
        (total: number, item: CartItem) => total + (item.product.prix * item.quantity),
        0
      ))
    );
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map((cart: CartItem[]) => cart.reduce(
        (count: number, item: CartItem) => count + item.quantity,
        0
      ))
    );
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        this.cartItems.next(cartData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      this.cartItems.next([]);
    }
  }
}