import { Component, Input } from '@angular/core';
import { HeroModel } from '../../../models/hero.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() hero!: HeroModel;
}
