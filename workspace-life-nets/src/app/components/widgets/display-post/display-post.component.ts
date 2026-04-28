import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';
import { APP_EXTERNAL_CONFIG } from '../../../app.config.token';

@Component({
  selector: 'app-display-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-post.component.html',
  styleUrl: './display-post.component.css',
})
export class DisplayPostComponent {
  config = inject(APP_EXTERNAL_CONFIG);
  @Input() post!: Post;
}



