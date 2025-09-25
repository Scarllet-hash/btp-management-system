// src/app/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../auth-modal/auth-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  searchQuery = '';
  showAuthModal = false;

  onSearch() {
    console.log('Recherche:', this.searchQuery);
  }

  onLogin() {
    this.showAuthModal = true;
  }

  onCloseAuthModal() {
    this.showAuthModal = false;
  }

  onHelp() {
    console.log('Aide');
  }

  onCartClick() {
    console.log('Panier');
  }
}