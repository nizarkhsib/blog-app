import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

  @Output() onEdit = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onEditClicked() {
    this.onEdit.next(true);
  }


}
