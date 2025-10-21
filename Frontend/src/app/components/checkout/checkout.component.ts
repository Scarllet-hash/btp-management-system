import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService, CartItem } from '../../services/product.service';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems$: Observable<CartItem[]>;  // ← CHANGÉ de any[] à CartItem[]
  cartTotal$: Observable<number>;
  
  currentStep = 1;
  isProcessingPayment = false;
  selectedPaymentMethod = 'card';

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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.cartItems$ = this.productService.cart$;
    this.cartTotal$ = this.productService.getCartTotal();

    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+212|0)[5-7][0-9]{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardName: [''],
      notes: [''],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
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
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];

    if (method === 'card') {
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
      this.checkoutForm.get('cardName')?.setValidators([Validators.required]);
    } else {
      cardFields.forEach(field => {
        this.checkoutForm.get(field)?.clearValidators();
      });
    }

    cardFields.forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  // ← MÉTHODE AJOUTÉE
  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isProcessingPayment = true;

    const orderData = {
      ...this.checkoutForm.value,
      paymentMethod: this.selectedPaymentMethod,
      items: this.productService.getCart(),
      total: this.productService.getCart().reduce(
        (sum, item) => sum + (item.product.prix * item.quantity),
        0
      ),
      orderDate: new Date()
    };

    console.log('Commande soumise:', orderData);

    setTimeout(() => {
      this.isProcessingPayment = false;
      this.productService.clearCart();
      this.router.navigate(['/order-success'], { 
        state: { orderData } 
      });
    }, 2000);
  }

  processPayment(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isProcessingPayment = true;
    setTimeout(() => this.completeOrder(), 3000);
  }

  completeOrder(): void {
    const orderData = {
      ...this.checkoutForm.value,
      paymentMethod: this.selectedPaymentMethod,
      orderDate: new Date().toISOString()
    };

    console.log('Commande confirmée:', orderData);
    this.productService.clearCart();

    this.router.navigate(['/order-confirmation'], {
      queryParams: { orderId: this.generateOrderId() }
    });
  }

  private generateOrderId(): string {
    return 'BTP-' + Date.now().toString(36).toUpperCase();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (!field?.errors) return '';

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
    return '';
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    value = value.substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  }

  // ← MÉTHODE AJOUTÉE
  calculateItemTotal(item: CartItem): number {
    return item.product.prix * item.quantity;
  }

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