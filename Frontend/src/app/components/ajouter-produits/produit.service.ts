import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }
  getEtats() {
    return this.http.get<string[]>('http://localhost:8080/api/produits/etats');
  }
  ajouterProduit(formData: FormData) {
    return this.http.post('http://localhost:8080/api/produits', formData);
  }
}