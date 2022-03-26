import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from 'src/app/shared/models/comment.dto';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() comments: Comment[];
  @Input() commentsCount: number;
  @Output() onViewMore = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  viewMoreClicked() {
    this.onViewMore.emit(true);
  }

}
