import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FollowerUser } from '../../services/profile.service';

export interface FollowersModalData {
  title: string;
  users: FollowerUser[];
}

@Component({
  selector: 'app-followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss'],
  standalone: false
})
export class FollowersModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FollowersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FollowersModalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getDefaultAvatar(): string {
    return '/assets/default-avatar.svg';
  }
}
