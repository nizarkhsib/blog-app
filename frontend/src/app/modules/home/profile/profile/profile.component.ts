import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Profile } from 'src/app/shared/models/profile';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  userProfile!: Profile;
  isOwnProfile = true;

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    this.route.params.subscribe(params => {
      let userId = params['userId'];
      
      // If userId is 'me', redirect to logged-in user's ID
      if (userId === 'me') {
        if (loggedUser?._id) {
          this.router.navigate(['/profile', loggedUser._id]);
        } else {
          // If not logged in and trying to access /profile/me, redirect to home
          this.router.navigate(['']);
        }
        return;
      }

      // Load the specified user's profile
      if (userId) {
        this.profileService
          .getProfileByUserId(userId)
          .subscribe(
            res => {
              this.userProfile = res;
              this.isOwnProfile = loggedUser?._id === res.user._id;
            }
          );
      }
    });
  }

  onEditClicked(event: any) {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '480px',
      maxWidth: '95vw',
      panelClass: 'modern-dialog',
      data: { ...this.userProfile },
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe(
        (result: Profile) => {
          this.userProfile = result;
        });
  }

}
