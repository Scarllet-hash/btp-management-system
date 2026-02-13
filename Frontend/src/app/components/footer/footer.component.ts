import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categorie, CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories: Categorie[] = [];
  currentYear = new Date().getFullYear();

  constructor(
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des categories du footer', err);
      }
    });
  }

  onCategoryClick(categoryId: number, event: Event): void {
    event.preventDefault();
    this.categorieService.selectCategory(categoryId);
    this.scrollToProductsSection();
  }

  private scrollToProductsSection(): void {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
