import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { Event } from '../models/event.model';
import { Publication } from '../models/publication.model';
import { Post } from '../models/post.model';
import { CardModel } from '../models/card.model';
import { MapperService } from '../mappers/mapper-service';

@Injectable({
  providedIn: 'root'
})
export class ItemsRepositoryService {

  private events: Event[] = [];
  private publications: Publication[] = [];
  private posts: Post[] = [];

  constructor(private api: ApiService, private mapperService: MapperService) { }

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



          this.api.getPubblications().subscribe({
            next: (dtos) => {
              this.publications = this.mapperService.fromPublicationDtoList(dtos);
              console.log('Publications caricati e mappati', this.publications);
            },
            error: (error) => {
              console.error('Errore Get Publications', error);
            }
          });




          this.api.getEvents().subscribe({
            next: (dtos) => {
              const typesString = this.mapperService.extractUniqueEventsTypesAsString(dtos);
              this.api.getList('event_type', typesString)
                .subscribe({
                  next: (types) => {
                    console.log('Get Event Types effettuato');
                    const featuredMediaString = this.mapperService.extractUniqueEventsFeaturedMediaAsString(dtos);
                    this.api.getList('media', featuredMediaString)
                      .subscribe({
                        next: (media) => {
                          console.log('Get featured Media effettuato');
                          this.events = this.mapperService.fromEventDtoList(dtos, types, media);
                        },
                        error: error => {
                          console.error('Errore Get Posts', error);
                        }
                      });
                  },
                  error: error => {
                    console.error('Errore Get Event Types', error);
                  }
                });

            },
            error: (error) => {
              console.error('Errore Get Events', error);
            }
          });


          this.api.getPosts()
            .subscribe({
              next: (dtos)  => {
                 this.posts = this.mapperService.fromPostDtoList(dtos);
             
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


    /*
        this.api.readEvents().subscribe(events => {
          this.events = events;
        });

    this.api.readPublications().subscribe(publications => {
      this.publications = publications;
    });

    this.api.readPosts().subscribe(posts => {
      this.posts = posts;
    });*/
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