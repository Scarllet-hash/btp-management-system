// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard';
import { HeaderComponent } from './header/header';
import { CommandesComponent } from './commandes/commandes';
import { GererProduitsComponent } from './gerer-produits/gerer-produits';
import { AjouterProduitsComponent } from './ajouter-produits/ajouter-produits';
import { PromouvoirProduitsComponent } from './promouvoir-produits/promouvoir-produits';
import { RelevesCompteComponent } from './releves-compte/releves-compte';

export const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    pathMatch: 'full'
  },
  {
    path: 'vendor-dashboard',
    component: VendorDashboardComponent,
    children: [
      { path: '', redirectTo: 'promouvoir-produits', pathMatch: 'full' },
      { path: 'commandes', component: CommandesComponent },
      { path: 'gerer-produits', component: GererProduitsComponent },
      { path: 'ajouter-produits', component: AjouterProduitsComponent },
      { path: 'promouvoir-produits', component: PromouvoirProduitsComponent },
      { path: 'releves-compte', component: RelevesCompteComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];