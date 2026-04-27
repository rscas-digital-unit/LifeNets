import { Component, Input, HostListener } from '@angular/core';
import { HeroModel } from '../../../models/hero.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() hero!: HeroModel;

  private scrollThreshold = 50;

  constructor(private router: Router) {}

  goToSection(event: Event, targetId: string): void {
    event.preventDefault();

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.executeScrollLogic(targetId);
    } else {
      this.router.navigate(['/'], { fragment: targetId }).then(() => {
        setTimeout(() => {
          this.executeScrollLogic(targetId);
        }, 500);
      });
    }
  }

  private executeScrollLogic(targetId: string): void {
    const element = document.getElementById(targetId);
    if (!element) return;

    const offset = 100;
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > this.scrollThreshold) {
      document.body.classList.add('going-down');
    } else {
      document.body.classList.remove('going-down');
    }
  }
}
