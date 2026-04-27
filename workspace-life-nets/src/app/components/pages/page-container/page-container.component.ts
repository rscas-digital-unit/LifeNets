import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../widgets/footer/footer.component';
import { HeaderComponent } from '../../widgets/header/header.component';
import { CardModel } from '../../../models/card.model';
import { ItemsRepositoryService } from '../../../services/items-repository.service';

@Component({
  selector: 'app-page-container',
  imports: [RouterOutlet, FooterComponent,HeaderComponent],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css',
})
export class PageContainerComponent implements OnInit {



  constructor(public repository: ItemsRepositoryService) {}

  ngOnInit(): void {
    this.repository.load();
  
  }

  

  
}
