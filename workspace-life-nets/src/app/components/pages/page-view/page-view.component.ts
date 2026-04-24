import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlideShowComponent } from '../../widgets/slide-show/slide-show.component';


import { HeaderComponent } from '../../widgets/header/header.component';

import { FooterComponent } from '../../widgets/footer/footer.component';
import { CallToActionComponent } from '../../widgets/call-to-action/call-to-action.component';
import { ItemsRepositoryService } from '../../../services/items-repository.service';
import { CardModel } from '../../../models/card.model';
import { ActivatedRoute } from '@angular/router';


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