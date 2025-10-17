import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategorieService, Categorie } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';

interface Product {
  nom: string;
  categorie: number | null; // Utilise l'id de la catégorie
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
export class AjouterProduitsComponent implements OnInit {
  produitService: any;

  constructor(
    private categorieService: CategorieService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  product: Product = {
    nom: '',
    categorie: null,
    prix: 0,
    quantite: 0,
    description: '',
    etat: '',
    images: []
  };

  categories: any[] = [];
  etats: { value: string, label: string }[] = [];
  selectedImages: string[] = [];

  // États pour gérer les étapes
  currentStep = 1;
  showForm = false;
  showSpecificationForm = false;
  showSuccessModal = false;

ngOnInit() {
  // Chargement des catégories
  this.categorieService.getCategories().subscribe(
    res => {
      this.categories = res;
      console.log('Catégories chargées:', res);
    },
    err => {
      console.error('Erreur lors du chargement des catégories', err);
    }
  );
  
  // Chargement des états - NOUVELLE URL
  this.http.get<string[]>('http://localhost:8080/api/produits/etats').subscribe(
    (etats: string[]) => {
      this.etats = etats.map(e => ({
        value: e,
        label: this.formatEtat(e)
      }));
      console.log('États chargés:', this.etats);
    },
    err => {
      console.error('Erreur lors du chargement des états', err);
    }
  );
}

  formatEtat(etat: string): string {
  return etat.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

  onCategoryChange() {
    this.checkFormDisplay();
  }

  onNameChange() {
    this.checkFormDisplay();
  }

  checkFormDisplay() {
    if (this.product.nom.trim() && this.product.categorie) {
      this.showForm = true;
      this.currentStep = 2;
      this.showSpecificationForm = true;
    } else {
      this.showForm = false;
      this.showSpecificationForm = false;
      this.currentStep = 1;
    }
  }

  isStep1Valid(): boolean {
    return !!(this.product.nom.trim() && this.product.categorie);
  }

  isStep2Valid(): boolean {
    return !!(
      this.product.prix > 0 &&
      this.product.quantite > 0 &&
      this.product.description.trim() &&
      this.product.etat
    );
  }

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
  if (!this.isFormValid()) return;

  const formData = new FormData();
  // Récupère l'id depuis AuthService (ou localStorage)
  const entrepriseBtpId = this.authService.getEntrepriseBtpId();
  // Le backend attend un champ "produit" avec un JSON, et "images" pour chaque fichier
  formData.append('produit', new Blob([JSON.stringify({
    nom: this.product.nom,
    categorieId: this.product.categorie,
    prix: this.product.prix,
    quantite: this.product.quantite,
    etat: this.product.etat,
    description: this.product.description
    , entrepriseBtpId: entrepriseBtpId
  })], { type: 'application/json' }));

  (this.product.images || []).forEach((file, i) => {
    if (file) {
      formData.append('images', file, file.name);
    }
  });

  // 🔄 Afficher un indicateur de chargement (optionnel)
  console.log('📤 Envoi du produit en cours...');

  this.http.post('http://localhost:8080/api/produits', formData).subscribe({
    next: (response: any) => {
      // ✅ Succès
      console.log('✅ Produit ajouté avec succès !', response);
      console.log('📦 ID du produit créé:', response.id);
      this.showSuccessModal = true;
    },
    // error: (error) => {
    //   // ❌ Erreur détaillée
    //   console.error('❌ Erreur lors de l\'ajout du produit:', error);
      
    //   let errorMessage = 'Erreur lors de l\'ajout du produit';
      
    //   // Messages d'erreur personnalisés selon le code HTTP
    //   if (error.status === 0) {
    //     errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    //   } else if (error.status === 400) {
    //     errorMessage = 'Données invalides. Vérifiez les informations saisies.';
    //   } else if (error.status === 403) {
    //     errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    //   } else if (error.status === 404) {
    //     errorMessage = 'Service introuvable. Vérifiez l\'URL de l\'API.';
    //   } else if (error.status === 500) {
    //     errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    //   } else if (error.error && error.error.message) {
    //     errorMessage = error.error.message;
    //   }
      
    //   alert(errorMessage);
    // }
  });
}

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  ajouterNouveauProduit() {
    this.resetForm();
    this.closeSuccessModal();
  }

  accederGestion() {
    this.router.navigate(['/vendor-dashboard/gerer-produits']);
    this.closeSuccessModal();
  }

  resetForm() {
    this.product = {
      nom: '',
      categorie: null,
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