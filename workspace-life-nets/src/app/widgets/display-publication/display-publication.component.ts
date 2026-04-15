import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publication } from '../../models/publication.model';


@Component({
  selector: 'app-display-publication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-publication.component.html',
  styleUrls: ['./display-publication.component.css']
})
export class DisplayPublicationComponent {
  @Input() publication!: Publication;

  

}