import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlideShowComponent } from '../../widgets/slide-show/slide-show.component';

import { ItemsRepositoryService } from '../../services/items-repository.service';
import { HeaderComponent } from '../../widgets/header.component/header.component';
import { CallToActionComponent } from '../../widgets/call-to-action.component/call-to-action.component';
import { FooterComponent } from '../../widgets/footer.component/footer.component';
import { CardModel } from '../../models/card.model';

@Component({
  selector: 'app-page-view',
  standalone: true,
  imports: [CommonModule, SlideShowComponent, HeaderComponent,CallToActionComponent,FooterComponent],
  templateUrl: './page-view.component.html'
})
export class PageViewComponent implements OnInit {

  items: CardModel[] = [];

  constructor(public repository: ItemsRepositoryService) {}

  ngOnInit(): void {
    this.repository.load();

  }
}