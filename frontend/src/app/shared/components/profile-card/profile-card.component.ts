import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Profile } from '../../models/profile';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit, OnChanges {

  @Input() profile: Profile;
  @Output() onEdit = new EventEmitter<boolean>();
  photoPath = 'https://bootdey.com/img/Content/avatar/avatar7.png';

  constructor() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.profile?.photoPath)
      this.photoPath = this.profile?.photoPath;
  }

  ngOnInit(): void {
  }

  onEditClicked() {
    this.onEdit.next(true);
  }

}
