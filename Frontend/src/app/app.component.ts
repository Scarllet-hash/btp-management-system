import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    HeaderComponent,  // Décommenté
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BTP-Store';
  currentRoute = '';
  cartItemCount$: Observable<number>;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    this.cartItemCount$ = this.productService.getCartItemCount();
  }

  ngOnInit(): void {
    // Suivre les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  isHomePage(): boolean {
    return this.currentRoute === '/' || this.currentRoute === '/products';
  }
}