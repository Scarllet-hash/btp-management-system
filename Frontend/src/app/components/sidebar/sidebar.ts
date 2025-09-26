// src/app/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type PageType = 'commandes' | 'gerer-produits' | 'ajouter-produits' | 'promouvoir-produits' | 'releves-compte';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  // Suppression de @Output pageSelected car on utilise le router maintenant
  
  isProductsExpanded = false;
  userEmail = 'nouhailameunity03@gmail.com';
  userName = 'Nouhaila MOUHLY';
  currentPage: PageType = 'promouvoir-produits';

  constructor(private router: Router) {
    // Écouter les changements de route pour mettre à jour currentPage et l'état du menu
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentPageFromUrl(event.url);
      });
    
    // Initialiser la page courante au démarrage
    this.updateCurrentPageFromUrl(this.router.url);
  }

  private updateCurrentPageFromUrl(url: string) {
    let newPage: PageType = 'promouvoir-produits';
    
    if (url.includes('commandes')) {
      newPage = 'commandes';
    } else if (url.includes('gerer-produits')) {
      newPage = 'gerer-produits';
      this.isProductsExpanded = true; // Expand menu si on est sur une page produit
    } else if (url.includes('ajouter-produits')) {
      newPage = 'ajouter-produits';
      this.isProductsExpanded = true; // Expand menu si on est sur une page produit
    } else if (url.includes('promouvoir-produits')) {
      newPage = 'promouvoir-produits';
    } else if (url.includes('releves-compte')) {
      newPage = 'releves-compte';
    }
    
    this.currentPage = newPage;
  }
// Ajoutez cette ligne avec vos autres propriétés
isUserMenuExpanded = false;

// Ajoutez cette méthode
toggleUserMenu() {
  this.isUserMenuExpanded = !this.isUserMenuExpanded;
}
  toggleProducts() {
    this.isProductsExpanded = !this.isProductsExpanded;
  }

  selectPage(page: PageType) {
    // Navigation avec le router au lieu d'émettre un événement
    this.currentPage = page;
    this.router.navigate(['/vendor-dashboard', page]);
  }
}