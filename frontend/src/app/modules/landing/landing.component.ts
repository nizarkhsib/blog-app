import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.isLoggedIn = !!this.authService.currentUserSubject.getValue();
  }

  getStarted(): void {
    this.router.navigate(['/articles']);
  }

  startWriting(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/write-dashboard']);
    } else {
      this.router.navigate(['/auth/register']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
