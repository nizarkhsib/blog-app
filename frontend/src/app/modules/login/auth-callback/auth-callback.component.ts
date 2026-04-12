import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-auth-callback',
  template: '<div class="loading"><p>Processing login...</p></div>',
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 18px;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleOAuthCallback(token);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }
}
