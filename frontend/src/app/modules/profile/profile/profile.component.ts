import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { Profile } from 'src/app/shared/models/profile';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userProfile: Profile;

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    this.profileService
      .getProfileByUserId(loggedUser._id)
      .subscribe(
        res => this.userProfile = res
      );
  }

  onEditClicked(event) {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '350px',
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
