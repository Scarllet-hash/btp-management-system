// src/app/auth-modal/auth-modal.component.ts
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  private router = inject(Router);
  
  isLoginMode = true; // true = connexion, false = inscription
  
  // Données de connexion
  email = '';
  password = '';
  
  // Données d'inscription
  registerData = {
    email: '',
    mot_de_passe: '',
    nom: '',
    telephone: ''
  };
  
  selectedCountry = 'Morocco';
  
  // Basculer entre connexion et inscription
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.resetForms();
  }
  
  // Réinitialiser les formulaires
  resetForms() {
    this.email = '';
    this.password = '';
    this.registerData = {
      email: '',
      mot_de_passe: '',
      nom: '',
      telephone: ''
    };
  }
  
  // Fermer la modal
  onClose() {
    this.closeModal.emit();
  }

  // Connexion avec redirection
  onLogin() {
    if (this.email.trim() && this.password.trim()) {
      console.log('Connexion:', { email: this.email, password: this.password });
      
      // Fermer la modal
      this.onClose();
      
      // Rediriger vers la sidebar vendeur
      this.router.navigate(['/vendor-dashboard']);
    }
  }
  
  // Inscription
  onRegister() {
    if (this.registerData.email.trim() && 
        this.registerData.mot_de_passe.trim() && 
        this.registerData.nom.trim() && 
        this.registerData.telephone.trim()) {
      console.log('Inscription:', this.registerData);
      // Logique d'inscription
    }
  }

  // Connexion avec Google
  onGoogleLogin() {
    console.log('Connexion avec Google');
  }

  // Connexion avec Facebook
  onFacebookLogin() {
    console.log('Connexion avec Facebook');
  }

  // Connexion avec Apple
  onAppleLogin() {
    console.log('Connexion avec Apple');
  }

  // Connexion avec Twitter/X
  onTwitterLogin() {
    console.log('Connexion avec Twitter/X');
  }

  // Problème de connexion
  onTroubleSigning() {
    console.log('Problème de connexion');
  }
}