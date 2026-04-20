import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayItemComponent } from '../display-item/display-item.component';
import { CardModel } from '../../../models/card.model';


@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [
    CommonModule,
    DisplayItemComponent
  ],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ QUESTA RIGA MANCAV
})
export class SlideShowComponent implements AfterViewInit, OnChanges {
  @Input() items: CardModel[] = [];



  @Input() sliderName: string = "";
  @Input() buttonText: string = "";
  @Input() buttonLink: string = "";

  @ViewChild('swiperEl', { static: true })
  swiperEl!: ElementRef<any>;

  itemsPerpage = 3;
  isBeginning = true;
  isEnd = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      const swiper = this.swiperEl.nativeElement.swiper;
      this.updateNavigationState(swiper);
    }
  }


  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement.swiper;

    // stato iniziale
    this.updateNavigationState(swiper);

    // ascolta ogni cambio slide
    this.swiperEl.nativeElement.swiper.on('slideChange', () => {
      this.updateNavigationState(swiper);
    });
}

  next(): void {
    this.swiperEl.nativeElement.swiper.slideNext();
  }

  prev(): void {
    this.swiperEl.nativeElement.swiper.slidePrev();
  }

  private updateNavigationState(swiper: any): void {
    this.isBeginning = swiper.activeIndex <= 0;
    this.isEnd = (swiper.activeIndex >= this.items.length - 3);
  }


getSlidesPerView(): number {
  return window.innerWidth < 768 ? 1.3 : 3;
}


}
