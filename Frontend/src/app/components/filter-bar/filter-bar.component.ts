import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categorie } from '../../services/categorie.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-bar">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="filter-buttons">
              <button
                class="filter-btn"
                [class.active]="selectedCategoryId === null"
                (click)="selectCategory(null)">
                Tous
              </button>
              <button
                *ngFor="let category of categories"
                class="filter-btn"
                [class.active]="selectedCategoryId === category.id"
                (click)="selectCategory(category.id)">
                {{ category.nom }}
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="sort-controls">
              <select class="form-select sort-select" (change)="onSortChange($event)">
                <option value="default">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      background: #fff;
      padding: 2rem 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #ddd;
      background: #fff;
      color: #333;
      border-radius: 25px;
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .filter-btn:hover {
      border-color: #8BC34A;
      color: #8BC34A;
      transform: translateY(-2px);
    }

    .filter-btn.active {
      background: #8BC34A;
      border-color: #8BC34A;
      color: #fff;
    }

    .sort-select {
      border-radius: 25px;
      border: 2px solid #ddd;
      padding: 0.75rem 1rem;
      font-weight: 500;
    }

    .sort-select:focus {
      border-color: #8BC34A;
      box-shadow: 0 0 0 0.2rem rgba(139, 195, 74, 0.25);
    }

    @media (max-width: 768px) {
      .filter-buttons {
        margin-bottom: 1rem;
      }

      .filter-btn {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class FilterBarComponent {
  @Input() categories: Categorie[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Output() categorySelected = new EventEmitter<number | null>();
  @Output() sortChanged = new EventEmitter<string>();

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.categorySelected.emit(categoryId);
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortChanged.emit(select.value);
  }
}
