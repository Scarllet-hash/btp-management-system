import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>('/api/categories');
  }
  getEtats() {
    return this.http.get<string[]>('/api/produits/etats');
  }
  ajouterProduit(formData: FormData) {
    return this.http.post('/api/produits', formData);
  }
}