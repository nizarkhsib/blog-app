import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Profile } from 'src/app/shared/models/profile';
import { FileService } from 'src/app/shared/services/file.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  file: File;
  userProfile: Profile = null;
  profileForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Profile,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private fileService: FileService
  ) {
    this.initForm();
  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.profileForm.patchValue({
      firstname: this.data.user.firstname,
      lastname: this.data.user.lastname,
      email: this.data.user.email
    });

    this.userProfile = this.data;

    this.fileService.getFile(this.data.photoPath)
      .subscribe(
        res => this.file = res
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  onSelect(event) {
    this.file = event.addedFiles[0];
  }

  onRemove(event) {
    this.file = null;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log('save clicked');
    this.profileService
      .updateWithPhoto(this.userProfile._id, this.profileForm.value, this.file)
      .subscribe(
        updatedProfile => this.dialogRef.close(updatedProfile)
      );
  }
}
