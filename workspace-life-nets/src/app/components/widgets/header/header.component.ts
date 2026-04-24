import { Component, Input, HostListener } from '@angular/core';
import { HeroModel } from '../../../models/hero.model';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() hero!: HeroModel;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
  this.route.fragment.subscribe(frag => {
    if (frag) {
      // Usiamo il delay solo per dare tempo alla Home di renderizzare le sezioni
      setTimeout(() => {
        // Creiamo un finto evento o modifichiamo la tua funzione 
        // per accettare solo l'ID se necessario
        this.executeScrollLogic(frag); 
      }, 500);
    }
  });
}

// La funzione che avevi già, la rendiamo riutilizzabile
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

// Questa rimane per i click manuali nell'header della Home
scrollTo(event: Event, targetId: string): void {
  event.preventDefault();
  this.executeScrollLogic(targetId);
}

  private scrollThreshold = 50; // px

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > this.scrollThreshold) {
      document.body.classList.add('going-down');
    } else {
      document.body.classList.remove('going-down');
    }
  }

 
}




