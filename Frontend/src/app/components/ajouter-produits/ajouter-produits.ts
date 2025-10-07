// src/app/ajouter-produits/ajouter-produits.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Product {
  nom: string;
  categorie: string;
  prix: number;
  quantite: number;
  description: string;
  etat: string;
  images: File[];
}

@Component({
  selector: 'app-ajouter-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-produits.html',
  styleUrls: ['./ajouter-produits.scss']
})
export class AjouterProduitsComponent {
  
  constructor(private router: Router) {}

  product: Product = {
    nom: '',
    categorie: '',
    prix: 0,
    quantite: 0,
    description: '',
    etat: '',
    images: []
  };

  categories = [
    'Matériaux de construction',
    'Outils et équipements',
    'Électricité & Éclairage',
    'Plomberie & Sanitaire',
    'Peinture & Revêtements',
    'Menuiserie & Bois',
    'Sécurité & Protection',
    'Machines & Engins'
  ];

  etats = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'bonne', label: 'Bonne état' },
    { value: 'mauvaise', label: 'Mauvaise état' }
  ];

  selectedImages: string[] = [];
  
  // États pour gérer les étapes
  currentStep = 1; // Étape actuelle (1 ou 2)
  showForm = false; // Affiche les champs nom/catégorie quand true
  showSpecificationForm = false; // Affiche l'étape 2 quand true
  showSuccessModal = false;

  onCategoryChange() {
    this.checkFormDisplay();
  }

  onNameChange() {
    this.checkFormDisplay();
  }

  checkFormDisplay() {
    if (this.product.nom.trim() && this.product.categorie) {
      this.showForm = true;
      this.currentStep = 2; // Passe automatiquement à l'étape 2
      this.showSpecificationForm = true; // Affiche les champs détaillés
    } else {
      this.showForm = false;
      this.showSpecificationForm = false;
      this.currentStep = 1; // Retourne à l'étape 1 si incomplet
    }
  }

  // Nouvelle méthode pour passer à l'étape 2
  proceedToSpecification() {
    if (this.isStep1Valid()) {
      this.currentStep = 2;
      this.showSpecificationForm = true;
    }
  }

  // Retour à l'étape 1
  backToInformation() {
    this.currentStep = 1;
    this.showSpecificationForm = false;
  }

  // Validation étape 1 (nom + catégorie + au moins une image optionnelle)
  isStep1Valid(): boolean {
    return !!(this.product.nom.trim() && this.product.categorie);
  }

  // Validation étape 2 (tous les champs requis)
  isStep2Valid(): boolean {
    return !!(
      this.product.prix > 0 &&
      this.product.quantite > 0 &&
      this.product.description.trim() &&
      this.product.etat
    );
  }

  // Validation complète du formulaire
  isFormValid(): boolean {
    return this.isStep1Valid() && this.isStep2Valid();
  }

  onImageSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.selectedImages[index] = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
      
      if (!this.product.images) {
        this.product.images = [];
      }
      this.product.images[index] = file;
    }
  }

  removeImage(index: number) {
    this.selectedImages[index] = '';
    if (this.product.images) {
      this.product.images[index] = null as any;
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      console.log('Produit à ajouter:', this.product);
      this.showSuccessModal = true;
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  ajouterNouveauProduit() {
    this.resetForm();
    this.closeSuccessModal();
  }

  accederGestion() {
    console.log('Navigation vers gérer produits');
    this.router.navigate(['/vendor-dashboard/gerer-produits']);
    this.closeSuccessModal();
  }

  resetForm() {
    this.product = {
      nom: '',
      categorie: '',
      prix: 0,
      quantite: 0,
      description: '',
      etat: '',
      images: []
    };
    this.selectedImages = [];
    this.showForm = false;
    this.showSpecificationForm = false;
    this.currentStep = 1;
  }

  goBack() {
    this.router.navigate(['/vendor-dashboard/gerer-produits']);
  }
}