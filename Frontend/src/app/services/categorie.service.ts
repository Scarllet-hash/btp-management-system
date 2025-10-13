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
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://localhost:8080/api/categories');
  }
}