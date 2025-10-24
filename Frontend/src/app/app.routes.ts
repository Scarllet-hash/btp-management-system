import { Routes } from '@angular/router';

// Imports pour la partie vendor/admin
import { VendorDashboardComponent } from './components/vendor-dashboard/vendor-dashboard';
import { CommandesComponent } from './components/commandes/commandes';
import { GererProduitsComponent } from './components/gerer-produits/gerer-produits';
import { AjouterProduitsComponent } from './components/ajouter-produits/ajouter-produits';
import { PromouvoirProduitsComponent } from './components/promouvoir-produits/promouvoir-produits';
import { RelevesCompteComponent } from './components/releves-compte/releves-compte';

// Imports pour la partie e-commerce client
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { ProductDetailComponent } from './components/product-detail/product-detail';


export const routes: Routes = [
  // Route par défaut - Page d'accueil avec liste des produits
  {
    path: '',
    component: ProductListComponent,
    pathMatch: 'full'
  },
  { path: 'products/:id', component: ProductDetailComponent },
  // Routes e-commerce client
  {
    path: 'products',
    component: ProductListComponent
  },
  
  {
    path: 'auth-modal',
    component: AuthModalComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent
  },
  
  // Routes dashboard vendor/admin
  {
    path: 'vendor-dashboard',
    component: VendorDashboardComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'promouvoir-produits', 
        pathMatch: 'full' 
      },
      { 
        path: 'commandes', 
        component: CommandesComponent 
      },
      { 
        path: 'gerer-produits', 
        component: GererProduitsComponent 
      },
      { 
        path: 'ajouter-produits', 
        component: AjouterProduitsComponent 
      },
      { 
        path: 'promouvoir-produits', 
        component: PromouvoirProduitsComponent 
      },
      { 
        path: 'releves-compte', 
        component: RelevesCompteComponent 
      }
    ]
  },
  
  // Route wildcard - redirection vers l'accueil
  {
    path: '**',
    redirectTo: ''
  }
];