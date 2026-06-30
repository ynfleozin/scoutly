import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isUserLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  startDemo(): void {
    this.authService.guestLogin().subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao iniciar demo', err);
        alert('Não foi possível iniciar demonstração no momento.');
      },
    });
  }
}
