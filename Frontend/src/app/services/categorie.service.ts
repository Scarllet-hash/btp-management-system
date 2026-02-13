import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private baseUrl = '/api/categories';
  private selectedCategorySubject = new Subject<number | null>();
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${categoryId}/produits`);
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategorySubject.next(categoryId);
  }
}
