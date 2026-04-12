import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: false
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input()
  public photoUrl!: string;

  @Input()
  public name!: string;

  public showInitials = false;
  public initials!: string;
  public circleColor!: string;

  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];

  ngOnInit() {
    this.updateDisplay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photoUrl'] || changes['name']) {
      this.updateDisplay();
    }
  }

  private updateDisplay(): void {
    if (!this.photoUrl) {
      this.showInitials = true;
      if (this.name) {
        this.createInititals();
      }
      if (!this.circleColor) {
        const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
        this.circleColor = this.colors[randomIndex];
      }
    } else {
      this.showInitials = false;
    }
  }

  private createInititals(): void {
    let initials = "";

    for (let i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === ' ') {
        continue;
      }

      if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
        initials += this.name.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }

    this.initials = initials;
  }
}