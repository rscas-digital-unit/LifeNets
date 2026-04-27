import { Component } from '@angular/core';
import { ItemsRepositoryService } from '../../../services/items-repository.service';
import { RouterLink } from '@angular/router';
import { TwoColumnsComponent } from '../../widgets/two-columns/two-columns.component';
import { InfoItem } from '../../../models/info-item.model';
import { FooterComponent } from '../../widgets/footer/footer.component';



@Component({
  selector: 'app-page-about',
  standalone: true,
  imports: [RouterLink, TwoColumnsComponent, FooterComponent],
  templateUrl: './page-about.component.html',
  styleUrl: './page-about.component.css',
})
export class PageAboutComponent {
  infoList:InfoItem[] =[];
  constructor(public repository: ItemsRepositoryService) {
    this.infoList= [
      { id: 'tab1', titolo: 'Storia', testo: 'Il nostro percorso nasce da un\'idea innovativa...' },
      { id: 'tab2', titolo: 'Missione', testo: 'Vogliamo portare soluzioni digitali a tutti...' },
      { id: 'tab3', titolo: 'Visione', testo: 'Immaginiamo un futuro dove la tecnologia è invisibile...' },
      { id: 'tab4', titolo: 'Valori', testo: 'Integrità, Passione e Innovazione sono i nostri pilastri.' }
    ];


  }
}
