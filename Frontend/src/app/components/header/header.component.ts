import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AuthModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('backgroundVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  
  cartItemCount$: Observable<number> = of(0);
  searchQuery: string = '';
  showAuthModal = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItemCount$ = this.productService.getCartItemCount();
  }

  ngAfterViewInit(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.volume = 0;
      video.muted = true;
      
      video.play().catch(error => {
        console.log('Autoplay bloqué par le navigateur:', error);
      });
    }
  }

  onLogin(): void {
    this.showAuthModal = true;
  }

  onCloseAuthModal(): void {
    this.showAuthModal = false;
  }

  onCartClick(): void {
    console.log('Cart clicked');
    this.router.navigate(['/cart']);
  }

  onVendorClick(): void {
    console.log('Vendor clicked');
    this.router.navigate(['/vendor-dashboard']);
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
    }
  }
}