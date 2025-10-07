import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../models/product';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  
  currentStep = 1;
  isLoading = false;
  isProcessingPayment = false;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: 'fas fa-credit-card',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'fab fa-paypal',
      description: 'Paiement sécurisé avec PayPal'
    },
    {
      id: 'bank',
      name: 'Virement bancaire',
      icon: 'fas fa-university',
      description: 'Virement bancaire direct'
    },
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      icon: 'fas fa-money-bill-wave',
      description: 'Payez en espèces lors de la livraison'
    }
  ];

  selectedPaymentMethod = 'card';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.cartItems$ = this.productService.getCart();
    this.cartTotal$ = this.productService.getCartTotal();
    
    this.checkoutForm = this.fb.group({
      // Informations personnelles
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+212|0)[5-7][0-9]{8}$/)]],
      
      // Adresse de livraison
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['Maroc', [Validators.required]],
      
      // Informations de paiement (pour carte)
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardName: [''],
      
      // Options
      saveInfo: [false],
      newsletter: [false],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Vérifier si le panier n'est pas vide
    this.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    
    // Gérer la validation des champs de carte
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    
    if (method === 'card') {
      cardFields.forEach(field => {
        this.checkoutForm.get(field)?.setValidators([Validators.required]);
      });
      
      // Validation spécifique pour les champs de carte
      this.checkoutForm.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{16}$/)
      ]);
      this.checkoutForm.get('expiryDate')?.setValidators([
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
      ]);
      this.checkoutForm.get('cvv')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{3,4}$/)
      ]);
    } else {
      // Supprimer les validations pour les autres méthodes
      cardFields.forEach(field => {
        this.checkoutForm.get(field)?.clearValidators();
      });
    }
    
    // Mettre à jour la validation
    cardFields.forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  processPayment(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isProcessingPayment = true;
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      this.completeOrder();
    }, 3000);
  }

  completeOrder(): void {
    // Ici vous pourriez envoyer les données à votre backend
    const orderData = {
      ...this.checkoutForm.value,
      paymentMethod: this.selectedPaymentMethod,
      items: this.cartItems$,
      total: this.cartTotal$,
      orderDate: new Date().toISOString()
    };
    
    console.log('Commande confirmée:', orderData);
    
    // Vider le panier
    this.productService.clearCart();
    
    // Rediriger vers la page de confirmation
    this.router.navigate(['/order-confirmation'], { 
      queryParams: { orderId: this.generateOrderId() }
    });
  }

  private generateOrderId(): string {
    return 'BTP-' + Date.now().toString(36).toUpperCase();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  calculateItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return 'Email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['pattern']) {
        switch (fieldName) {
          case 'phone': return 'Numéro de téléphone invalide';
          case 'postalCode': return 'Code postal invalide';
          case 'cardNumber': return 'Numéro de carte invalide';
          case 'expiryDate': return 'Format: MM/YY';
          case 'cvv': return 'CVV invalide';
          default: return 'Format invalide';
        }
      }
    }
    return '';
  }

  // Formatage automatique des champs
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    event.target.value = value;
    this.checkoutForm.get('cardNumber')?.setValue(value.replace(/\s/g, ''));
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.checkoutForm.get('expiryDate')?.setValue(value);
  }

  // Méthodes helper pour les templates
  getSelectedPaymentMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(p => p.id === this.selectedPaymentMethod);
  }

  getSelectedPaymentIcon(): string {
    return this.getSelectedPaymentMethod()?.icon || '';
  }

  getSelectedPaymentName(): string {
    return this.getSelectedPaymentMethod()?.name || '';
  }
}