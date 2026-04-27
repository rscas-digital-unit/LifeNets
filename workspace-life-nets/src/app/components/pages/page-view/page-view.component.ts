import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
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
  imports: [CommonModule, SlideShowComponent, CallToActionComponent],
  templateUrl: './page-view.component.html'
})
export class PageViewComponent implements OnInit {
 items: CardModel[] = [];

  
  scrollThreshold = 100;

  constructor(private route: ActivatedRoute, public repository: ItemsRepositoryService) {}

  ngOnInit(): void {
  this.repository.goToPage("Landing");
    

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.executeScrollLogic(fragment);
      }
    });
  }

  private executeScrollLogic(targetId: string): void {
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (!element) return;

      const offset = 100;
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }, 0);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.scrollY > this.scrollThreshold) {
      document.body.classList.add('going-down');
    } else {
      document.body.classList.remove('going-down');
    }
  }


   



}
