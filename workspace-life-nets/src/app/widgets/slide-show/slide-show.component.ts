import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisplayItemComponent } from '../display-item/display-item.component';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { CardModel } from '../../models/card.model';

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
export class SlideShowComponent implements AfterViewInit{
  @Input() items: CardModel[] = [];


  
 @Input() sliderName: string="Pippo";
 
 
  @ViewChild('swiperEl', { static: true })
  swiperEl!: ElementRef<any>;

  itemsPerpage = 3;
isBeginning = true;
  isEnd = false;

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
    this.isBeginning = swiper.activeIndex<=0;
    this.isEnd = (swiper.activeIndex>=this.items.length-3);
  }


  


}