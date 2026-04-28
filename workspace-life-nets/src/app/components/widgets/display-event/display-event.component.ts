import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event.model';
import { APP_EXTERNAL_CONFIG } from '../../../app.config.token';

@Component({
  selector: 'app-display-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-event.component.html',
  styleUrls: ['./display-event.component.css']
})
export class DisplayEventComponent {
  config = inject(APP_EXTERNAL_CONFIG);
  @Input() event!: Event;
}