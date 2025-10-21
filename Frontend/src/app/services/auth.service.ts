import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface UserData {
  id: number;
  email: string;
  nom: string;
  type: string;
  entrepriseBtpId?: number;
  entrepriseRecyclageId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor() {
    // Récupérer les données utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<UserData | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  // Méthode pour sauvegarder les données utilisateur après connexion
  setCurrentUser(userData: UserData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  // Méthode pour récupérer l'ID de l'entreprise BTP
  getEntrepriseBtpId(): number | null {
    const user = this.currentUserValue;
    return user?.entrepriseBtpId || null;
  }

  // Méthode pour récupérer l'ID de l'entreprise de recyclage
  getEntrepriseRecyclageId(): number | null {
    const user = this.currentUserValue;
    return user?.entrepriseRecyclageId || null;
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  // Méthode pour déconnexion
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Récupérer le type d'utilisateur
  getUserType(): string | null {
    return this.currentUserValue?.type || null;
  }
}