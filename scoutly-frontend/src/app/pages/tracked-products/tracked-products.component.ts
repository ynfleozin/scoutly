import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrackingResponseDTO } from '../../models/tracking.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tracked-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tracked-products.component.html',
  styleUrl: './tracked-products.component.scss',
})
export class TrackedProductsComponent {
  private trackingService = inject(TrackingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  products: TrackingResponseDTO[] = [];
  trackingForm: FormGroup;
  apiErrorMessage: string | null = null;

  constructor() {
    this.trackingForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      name: ['', Validators.required],
      targetPrice: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  get activeProductsCount(): number {
    return this.products.filter((product) => product.active).length;
  }

  loadProducts(): void {
    this.trackingService.getTrackedProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erro ao carregar produtos', err),
    });
  }

  onSubmit(): void {
    if (this.trackingForm.valid) {
      this.apiErrorMessage = null;

      this.trackingService
        .addTrackedProduct(this.trackingForm.value)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.trackingForm.reset();
          },
          error: (err) => {
            console.error('Erro ao cadastrar', err);
            if (err.status === 400) {
              this.apiErrorMessage =
                'Esta loja ainda não é suportada pelo Scoutly.';
            } else {
              this.apiErrorMessage =
                'Ocorreu um erro no servidor. Tente novamente.';
            }
          },
        });
    }
  }

  deleteProduct(id: string): void {
    this.trackingService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Erro ao deletar', err),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleStatus(id: string): void {
    this.trackingService.toggleStatus(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Erro ao pausar alerta', err),
    });
  }
}
