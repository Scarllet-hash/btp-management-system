import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Success Message -->
            <div class="confirmation-card">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              
              <h1 class="confirmation-title">Commande confirmée !</h1>
              
              <p class="confirmation-message">
                Merci pour votre commande. Nous avons bien reçu votre paiement et votre commande est en cours de traitement.
              </p>
              
              <div class="order-details">
                <div class="order-number">
                  <strong>Numéro de commande : {{ orderId }}</strong>
                </div>
                <div class="order-date">
                  Commandé le {{ orderDate | date:'dd/MM/yyyy à HH:mm' }}
                </div>
              </div>
              
              <!-- Next Steps -->
              <div class="next-steps">
                <h3>Que se passe-t-il maintenant ?</h3>
                <div class="steps-timeline">
                  <div class="timeline-step">
                    <div class="step-icon completed">
                      <i class="fas fa-check"></i>
                    </div>
                    <div class="step-content">
                      <h4>Commande confirmée</h4>
                      <p>Votre commande a été reçue et est en cours de traitement</p>
                    </div>
                  </div>
                  
                  <div class="timeline-step">
                    <div class="step-icon">
                      <i class="fas fa-box"></i>
                    </div>
                    <div class="step-content">
                      <h4>Préparation (24-48h)</h4>
                      <p>Nos équipes préparent soigneusement votre commande</p>
                    </div>
                  </div>
                  
                  <div class="timeline-step">
                    <div class="step-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="step-content">
                      <h4>Expédition (2-5 jours)</h4>
                      <p>Votre commande sera expédiée et vous recevrez un email de suivi</p>
                    </div>
                  </div>
                  
                  <div class="timeline-step">
                    <div class="step-icon">
                      <i class="fas fa-home"></i>
                    </div>
                    <div class="step-content">
                      <h4>Livraison</h4>
                      <p>Réception de votre commande à l'adresse indiquée</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Email Confirmation -->
              <div class="email-info">
                <div class="info-card">
                  <i class="fas fa-envelope"></i>
                  <div class="info-content">
                    <h4>Email de confirmation envoyé</h4>
                    <p>Un email de confirmation avec tous les détails de votre commande vous a été envoyé.</p>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="confirmation-actions">
                <button class="btn btn-primary btn-lg" (click)="continueShopping()">
                  <i class="fas fa-shopping-cart me-2"></i>
                  Continuer mes achats
                </button>
                <button class="btn btn-outline-secondary btn-lg" (click)="goToHome()">
                  <i class="fas fa-home me-2"></i>
                  Retour à l'accueil
                </button>
              </div>
              
              <!-- Support Info -->
              <div class="support-info">
                <h4>Besoin d'aide ?</h4>
                <div class="support-contacts">
                  <div class="support-item">
                    <i class="fas fa-phone"></i>
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div class="support-item">
                    <i class="fas fa-envelope"></i>
                    <span>support@btp-store.fr</span>
                  </div>
                  <div class="support-item">
                    <i class="fas fa-comments"></i>
                    <span>Chat en ligne disponible 24h/7j</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 4rem 0;
      display: flex;
      align-items: center;
    }

    .confirmation-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    .success-icon {
      font-size: 5rem;
      color: #28a745;
      margin-bottom: 2rem;
      animation: bounce 1s ease-in-out;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }

    .confirmation-title {
      color: #333;
      font-weight: 700;
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }

    .confirmation-message {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .order-details {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin: 2rem 0;
      border-left: 4px solid #28a745;
    }

    .order-number {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .order-date {
      color: #666;
      font-size: 1rem;
    }

    .next-steps {
      margin: 3rem 0;
      text-align: left;
    }

    .next-steps h3 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .steps-timeline {
      position: relative;
      padding-left: 2rem;
    }

    .steps-timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ddd;
    }

    .timeline-step {
      position: relative;
      margin-bottom: 2rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f8f9fa;
      border: 2px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      flex-shrink: 0;
    }

    .step-icon.completed {
      background: #28a745;
      border-color: #28a745;
      color: white;
    }

    .step-content h4 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .step-content p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .email-info {
      margin: 2rem 0;
    }

    .info-card {
      background: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 10px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
    }

    .info-card i {
      font-size: 2rem;
      color: #1976d2;
      flex-shrink: 0;
    }

    .info-content h4 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .info-content p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .confirmation-actions {
      margin: 3rem 0;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(45deg, #8BC34A, #4CAF50);
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(139, 195, 74, 0.4);
    }

    .btn-outline-secondary {
      border: 2px solid #6c757d;
      color: #6c757d;
    }

    .btn-outline-secondary:hover {
      background: #6c757d;
      transform: translateY(-3px);
    }

    .support-info {
      border-top: 1px solid #eee;
      padding-top: 2rem;
      margin-top: 2rem;
    }

    .support-info h4 {
      color: #333;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .support-contacts {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .support-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.95rem;
    }

    .support-item i {
      color: #8BC34A;
      width: 20px;
    }

    @media (max-width: 768px) {
      .confirmation-container {
        padding: 2rem 0;
      }
      
      .confirmation-card {
        padding: 2rem;
        margin: 1rem;
      }
      
      .confirmation-title {
        font-size: 2rem;
      }
      
      .success-icon {
        font-size: 4rem;
      }
      
      .confirmation-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .btn-lg {
        width: 100%;
        margin-bottom: 1rem;
      }
      
      .support-contacts {
        flex-direction: column;
        gap: 1rem;
      }
      
      .info-card {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  orderDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'BTP-' + Date.now().toString(36).toUpperCase();
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}