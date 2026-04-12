import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Event, Router, Scroll } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LoggedUser } from 'src/app/shared/models/logged-user';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: false
})
export class NavigationComponent implements OnDestroy, AfterViewInit {

  loggedUser: LoggedUser | null = null;
  isLogged = false;
  alive = true;
  profilePhotoUrl: string | null = null;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService) {

    this.loggedUser = this.authenticationService.currentUserSubject.getValue();
    this.loggedUser ? this.isLogged = true : this.isLogged = false;

    if (this.loggedUser?._id) {
      this.profileService.getProfileByUserId(this.loggedUser._id).subscribe({
        next: (profile) => { this.profilePhotoUrl = profile?.photoPath || null; },
        error: () => {}
      });
    }
  }
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  navigateToLogin() {
    this.router.navigate(['auth']);
  }

  logout() {
    this.authenticationService.logout();
  }

  navigateToWriteArticle() {
    this.router.navigate(['user-dashboard']);
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  getUserInitials(): string {
    const f = this.loggedUser?.firstname?.[0] ?? '';
    const l = this.loggedUser?.lastname?.[0] ?? '';
    return (f + l).toUpperCase();
  }

}
