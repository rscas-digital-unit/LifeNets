import { Component, Input, HostListener } from '@angular/core';
import { HeroModel } from '../../../models/hero.model';
import { Router, RouterModule } from '@angular/router';
import { ItemsRepositoryService } from '../../../services/items-repository.service';
import { HeaderModel } from '../../../models/header.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {




  constructor(private router: Router, public repository: ItemsRepositoryService) {}

goToSection(event: Event, targetId: string): void {
  event.preventDefault();
  this.router.navigate(['/'], { fragment: targetId });
}

}
