import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  @Input() data: any[] = [];
  // a template reference of a HTML element
  // a template reference of a HTML element
  @Input()
  itemTemplate!: TemplateRef<HTMLElement> | null;
  constructor() { }

  ngOnInit(): void {

  }

}
