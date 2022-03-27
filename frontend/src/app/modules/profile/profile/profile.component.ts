import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    this.profileService.getProfileByUserId(loggedUser._id)
      .subscribe(
        res => console.log('res', res)
      );
  }

  onEditClicked(event) {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      width: '350px',
      data: {},
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log('The dialog was closed');
        // this.animal = result;
      });
  }

}
