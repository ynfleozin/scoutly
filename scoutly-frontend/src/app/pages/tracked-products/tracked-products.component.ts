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

@Component({
  selector: 'app-tracked-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tracked-products.component.html',
  styleUrl: './tracked-products.component.scss',
})
export class TrackedProductsComponent {
  private trackingService = inject(TrackingService);
  private fb = inject(FormBuilder);

  products: TrackingResponseDTO[] = [];
  trackingForm: FormGroup;

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

  loadProducts(): void {
    this.trackingService.getTrackedProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erro ao carregar produtos', err),
    });
  }

  onSubmit(): void {
    if (this.trackingForm.valid) {
      this.trackingService
        .addTrackedProduct(this.trackingForm.value)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.trackingForm.reset();
          },
          error: (err) => console.error('Erro ao cadastrar', err),
        });
    }
  }

  deleteProduct(id: string): void {
    this.trackingService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Erro ao deletar', err),
    });
  }

  deactivate(id: string): void {
    this.trackingService.deactivateAlert(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Erro ao pausar alerta', err),
    });
  }
}
