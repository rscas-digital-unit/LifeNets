import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { Event } from '../models/event.model';
import { Publication } from '../models/publication.model';
import { Post } from '../models/post.model';
import { CardModel } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsRepositoryService {

  private events: Event[] = [];
  private publications: Publication[] = [];
  private posts: Post[] = [];

  constructor(private api: ApiService) {}

  load(): void {
    this.api.loginWithTechnicalUser()
.subscribe({
      next: response => {
        console.log('Login tecnico effettuato');
         this.api.validateToken()
.subscribe({
      next: response => {
        console.log('Validate toker effettuato');
      },
      error: error => {
        console.error('Errore Validate toker', error);
      }
    });

    
    this.api.getPubblications()
.subscribe({
      next: response => {
        console.log('Get Pubblications effettuato');
      },
      error: error => {
        console.error('Errore Get Pubblications', error);
      }
    });

this.api.getEvents()
.subscribe({
      next: response => {
        console.log('Get Events effettuato');
      },
      error: error => {
        console.error('Errore Get Events', error);
      }
    });

    this.api.getPosts()
.subscribe({
      next: response => {
        console.log('Get Posts effettuato');
      },
      error: error => {
        console.error('Errore Get Posts', error);
      }
    });

    this.api.getAdvertisings()
.subscribe({
      next: response => {
        console.log('Get Advertisings effettuato');
      },
      error: error => {
        console.error('Errore Get Advertisings', error);
      }
    });


      },
      error: error => {
        console.error('Errore login tecnico', error);
      }
    });

   

    this.api.readEvents().subscribe(events => {
      this.events = events;
    });

    this.api.readPublications().subscribe(publications => {
      this.publications = publications;
    });

     this.api.readPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getPublications(): Publication[] {
    return this.publications;
  }

  getAllItems(): CardModel[] {
    return [...this.events, ...this.publications];
  }
}