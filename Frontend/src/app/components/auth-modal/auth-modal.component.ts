import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  private http = inject(HttpClient);
  
  isLoginMode = true; // true = connexion, false = inscription
  
  // Données d'inscription (avec tous les champs possibles)
  registerData: any = {
    email: '',
    mot_de_passe: '',
    nom: '',
    telephone: '',
    type: '',
    siret: '',
    type_activite: '',
    licence: '',
    capacite_traitement: ''
  };
  
  email = '';
  password = '';
  
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.resetForms();
  }
  
  resetForms() {
    this.email = '';
    this.password = '';
    this.registerData = {
      email: '',
      mot_de_passe: '',
      nom: '',
      telephone: '',
      type: '',
      siret: '',
      type_activite: '',
      licence: '',
      capacite_traitement: ''
    };
  }
  
    isRegisterDisabled(): boolean {
    // Champs communs obligatoires pour tous les types
    if (!this.registerData.email.trim() ||
        !this.registerData.mot_de_passe.trim() ||
        !this.registerData.nom.trim() ||
        !this.registerData.telephone.trim()) {
      return true;
    }
    // + champs spécifiques selon le type
    switch(this.registerData.type) {
      case 'Entreprise BTP':
        return !this.registerData.siret.trim() || !this.registerData.type_activite.trim();
      case 'Entreprise de recyclage':
        return !this.registerData.licence.trim() || !this.registerData.capacite_traitement.trim();
      default:
        return false; // Personne, déjà validé plus haut
    }
  }
  
  onClose() {
    this.closeModal.emit();
  }

onLogin() {
  if (this.email.trim() && this.password.trim()) {
    this.http.post('/api/auth/login', {
      email: this.email,
      motDePasse: this.password
    }).subscribe({
      next: (res: any) => {
        // alert('Connexion réussie !');
        this.onClose();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.error && typeof err.error === "string") {
          alert("Erreur lors de la connexion : " + err.error);
        } else if (err.error && err.error.message) {
          alert("Erreur lors de la connexion : " + err.error.message);
        } else if (err.status) {
          alert("Erreur HTTP " + err.status + " lors de la connexion");
        } else {
          alert("Erreur lors de la connexion : " + JSON.stringify(err.error));
        }
      }
    });
  }
}
  onRegister() {
    let payload: any = {
      type: this.registerData.type,
      email: this.registerData.email,
      motDePasse: this.registerData.mot_de_passe,
      nom: this.registerData.nom,
      telephone: this.registerData.telephone
    };

    if (this.registerData.type === 'Entreprise BTP') {
      payload.siret = this.registerData.siret;
      payload.typeActivite = this.registerData.type_activite;
    } else if (this.registerData.type === 'Entreprise de recyclage') {
      payload.licence = this.registerData.licence;
      payload.capaciteTraitement = this.registerData.capacite_traitement;
    }

    this.http.post('/api/auth/register', payload).subscribe({
  next: (res: any) => {
    // Affiche le message retourné par le backend (optionnel)
    // alert(res.message || 'Inscription réussie !');
    this.toggleMode(); // ou this.router.navigate(['/login']);
  },
  error: (err) => {
    if (err.error && err.error.message) {
      alert("Erreur lors de l'inscription : " + err.error.message);
    } else if (err.error && typeof err.error === "string") {
      alert("Erreur lors de l'inscription : " + err.error);
    } else {
      alert("Erreur lors de l'inscription : " + JSON.stringify(err.error));
    }
  }
});
  }

  onGoogleLogin() { console.log('Connexion avec Google'); }
  onFacebookLogin() { console.log('Connexion avec Facebook'); }
  onAppleLogin() { console.log('Connexion avec Apple'); }
  onTwitterLogin() { console.log('Connexion avec Twitter/X'); }
  onTroubleSigning() { console.log('Problème de connexion'); }
}