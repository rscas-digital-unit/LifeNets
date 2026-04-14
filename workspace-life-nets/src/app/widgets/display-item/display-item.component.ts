import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Event } from '../../models/event.model';
import { Post } from '../../models/post.model';
import { Publication } from '../../models/publication.model';


import { DisplayEventComponent } from '../display-event/display-event.component';
import { DisplayPublicationComponent } from '../display-publication/display-publication.component';
import { DisplayPostComponent } from '../display-post.component/display-post.component';
import { CardModel } from '../../models/card.model';

@Component({
  selector: 'app-display-item',
  standalone: true,
  imports: [
    CommonModule,
    DisplayEventComponent,
    DisplayPublicationComponent,
    DisplayPostComponent
  ],
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.css']
})
export class DisplayItemComponent {
  @Input() item!: CardModel;

  isEvent(item: CardModel): item is Event {
    return item instanceof Event;
  }

  isPublication(item: CardModel): item is Publication {
    return item instanceof Publication;
  }

  isPost(item: CardModel): item is Post {
    return item instanceof Post;
  }
}
