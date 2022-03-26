import { Component, OnInit } from '@angular/core';
import { TabItem } from './tab-item';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  tabs: TabItem[] = [
    {
      label: 'Login',
      icon: 'home',
      route: 'login',
    },
    {
      label: 'Register',
      icon: 'person',
      route: 'register',
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}