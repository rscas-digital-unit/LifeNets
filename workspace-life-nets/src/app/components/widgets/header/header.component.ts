import { Component, Input, HostListener } from '@angular/core';
import { HeroModel } from '../../../models/hero.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() hero!: HeroModel;

  private scrollThreshold = 50; // px

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > this.scrollThreshold) {
      document.body.classList.add('going-down');
    } else {
      document.body.classList.remove('going-down');
    }
  }

  scrollTo(event: Event, targetId: string): void {
    event.preventDefault();

    const element = document.getElementById(targetId);
    if (!element) return;

    const offset = 100; // altezza header

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}




