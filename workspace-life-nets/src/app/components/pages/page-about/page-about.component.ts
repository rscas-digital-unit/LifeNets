import { Component } from '@angular/core';
import { ItemsRepositoryService } from '../../../services/items-repository.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-about',
  imports: [RouterLink],
  templateUrl: './page-about.component.html',
  styleUrl: './page-about.component.css',
})
export class PageAboutComponent {
constructor(public repository: ItemsRepositoryService) {}
}
