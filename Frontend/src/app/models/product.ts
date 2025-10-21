// product.model.ts
export type EtatProduit = 'NEUF' | 'BON_ETAT' | 'MAUVAIS_ETAT';

export interface Product {
  id: number;                 // Identifiant unique du produit
  nom: string;                // Nom du produit
  description: string;        // Description du produit
  quantite: number;           // Quantité disponible en stock
  prix: number;               // Prix du produit (en MAD par exemple)
  etat: EtatProduit;          // État du produit, selon l'enum défini
  categorie?: string;         // Nom de la catégorie (optionnel pour l'instant)
  entreprise?: string;        // Nom de l'entreprise (optionnel)
  images?: string[];          // Liste de liens vers les images du produit
}
export interface CartItem {
  product: Product;
  quantity: number;
}