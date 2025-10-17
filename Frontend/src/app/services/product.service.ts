import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Product, CartItem } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartItemCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // Obtenir tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getEtats() {
  return this.http.get<string[]>('http://localhost:8080/api/produits/etats');
}

  // Obtenir un produit par ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les produits par catégorie
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  // Obtenir toutes les catégories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  // Gestion du panier
  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }

    this.updateCart(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.updateCart(updatedCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart(currentCart);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCountSubject.asObservable();
  }

  getCartTotal(): Observable<number> {
    return new Observable(observer => {
      this.cartSubject.subscribe(cart => {
        const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }

  private updateCart(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCountSubject.next(totalItems);
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  // Données mockées pour les produits BTP si l'API externe ne fonctionne pas
  getMockBTPProducts(): Observable<Product[]> {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "Ciment Portland 25kg",
        price: 12.99,
        description: "Ciment de haute qualité pour tous vos travaux de construction et maçonnerie.",
        category: "ciment",
        image: "/assets/images/products/ciment-portland.jpg",
        rating: { rate: 4.5, count: 156 }
      },
      {
        id: 2,
        title: "Perceuse visseuse sans fil 18V",
        price: 89.99,
        description: "Perceuse visseuse professionnelle avec batterie lithium-ion haute performance.",
        category: "outils",
        image: "/assets/images/products/perceuse-18v.jpg",
        rating: { rate: 4.8, count: 203 }
      },
      {
        id: 3,
        title: "Isolation laine de roche 100mm",
        price: 24.50,
        description: "Panneaux d'isolation thermique et acoustique en laine de roche.",
        category: "isolation",
        image: "/assets/images/products/laine-roche.jpg",
        rating: { rate: 4.3, count: 89 }
      },
      {
        id: 4,
        title: "Tube PVC évacuation Ø100",
        price: 8.75,
        description: "Tube PVC blanc pour évacuation des eaux usées, longueur 3m.",
        category: "plomberie",
        image: "/assets/images/products/tube-pvc.jpg",
        rating: { rate: 4.1, count: 67 }
      }
    ];
    
    return of(mockProducts);
  }
}