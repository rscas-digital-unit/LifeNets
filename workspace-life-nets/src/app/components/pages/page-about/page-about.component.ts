import { Component, OnInit } from '@angular/core';
import { ItemsRepositoryService } from '../../../services/items-repository.service';
import { RouterLink } from '@angular/router';
import { TwoColumnsComponent } from '../../widgets/two-columns/two-columns.component';
import { InfoItem } from '../../../models/info-item.model';
import { HeaderComponent } from '../../widgets/header/header.component';
import { FooterComponent } from '../../widgets/footer/footer.component';



@Component({
  selector: 'app-page-about',
  standalone: true,
  imports: [ TwoColumnsComponent],
  templateUrl: './page-about.component.html',
  styleUrl: './page-about.component.css',
})
export class PageAboutComponent implements OnInit{
  infoList:InfoItem[] =[];
  constructor(public repository: ItemsRepositoryService) {
  


  }

   ngOnInit(): void {
  this.repository.goToPage("About");
   }
}
