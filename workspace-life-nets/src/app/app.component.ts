import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageContainerComponent } from './components/pages/page-container/page-container.component';

@Component({
  selector: 'app-root',
  imports: [PageContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'workspace-life-nets';
}
