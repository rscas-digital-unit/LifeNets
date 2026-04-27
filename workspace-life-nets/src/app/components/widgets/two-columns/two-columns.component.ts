import { Component, Input } from '@angular/core';
import { InfoItem } from '../../../models/info-item.model';
import { AboutTabModel } from '../../../models/about.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-columns',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './two-columns.component.html',
  styleUrl: './two-columns.component.css',
})
export class TwoColumnsComponent {
@Input() items: AboutTabModel[] = [];


trackById(_: number, item: AboutTabModel) {
  return item.id;
}

}
