import { Component, Input } from '@angular/core';
import { Advertising } from '../../../models/advertising.model';


@Component({
  selector: 'app-call-to-action',
  imports: [],
  templateUrl: './call-to-action.component.html',
  styleUrl: './call-to-action.component.css',
})
export class CallToActionComponent {
  @Input() advertising!: Advertising;
}
