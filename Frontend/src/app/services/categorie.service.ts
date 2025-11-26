import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private baseUrl = '/api/categories';

  constructor(private http: HttpClient) {}

   getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl);
  }

  // Récupère les produits d'une catégorie
  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${categoryId}/produits`);
  }
}