import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { Event } from '../models/event.model';
import { Publication } from '../models/publication.model';
import { Post } from '../models/post.model';
import { CardModel } from '../models/card.model';
import { MapperService } from '../mappers/mapper-service';
import { forkJoin, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsRepositoryService {

  private events: Event[] = [];
  private publications: Publication[] = [];
  private posts: Post[] = [];

  constructor(private api: ApiService, private mapperService: MapperService) { }


loadEvents(){
  this.api.getEvents().pipe(

  switchMap(dtos => {
    const typesString = this.mapperService.extractUniqueAsString(
      dtos,
      dto => dto.event_type
    );

    const featuredMediaString = this.mapperService.extractUniqueAsString(
      dtos,
      dto => dto.featured_media
    );

    return forkJoin({
      dtos: of(dtos),
      types: this.api.getList('event_type', typesString),
      media: this.api.getList('media', featuredMediaString)
    });
  }),

  tap(({ dtos, types, media }) => {
    this.events = this.mapperService.fromEventDtoList(dtos, types, media);
  })

).subscribe({
  error: error => {
    console.error('Errore caricamento eventi', error);
  }
});

}


loadPublications(): void {
  this.api.getPubblications().pipe(

    // 🔹 Primo stadio: carico publications + decodifiche dirette
    switchMap(dtos => {

      const featuredMediaString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.featured_media
      );

      const featuredTagsString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.tags
      );

      const featuredCategoriesString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.categories
      );

      const peopleIdsString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => [
          ...(dto.acf.authors_relationship ?? []),
          ...(dto.acf.editors_relationship ?? [])
        ]
      );

      return forkJoin({
        dtos: of(dtos),
        media: this.api.getList('media', featuredMediaString),
        tags: this.api.getList('tags', featuredTagsString),
        categories: this.api.getList('categories', featuredCategoriesString),
        people: this.api.getPeopleList(peopleIdsString)
      });
    }),

    switchMap(({ dtos, media, tags, categories, people }) => {

      const peopleMediaString = this.mapperService.extractPeopleFeaturedMediaAsString(
        people
      );

      return forkJoin({
        dtos: of(dtos),
        media: of(media),          
        tags: of(tags),            
        categories: of(categories),
        people: of(people),        
        peopleMedia: this.api.getList('media', peopleMediaString)
      });

    }),

    tap(({ dtos, media, tags, categories, people, peopleMedia }) => {
      this.publications = this.mapperService.fromPublicationDtoList(
        dtos,
        media,
        tags,
        categories,
        people,
        peopleMedia
      );
    })

  ).subscribe({
    error: error => {
      console.error('Errore caricamento publications', error);
    }
  });
}


loadPosts(): void {
  this.api.getPosts().pipe(

    // 🔹 Primo livello: DTO + media post + people (autori)
    switchMap(dtos => {
      console.log("POST DTO");
      console.log(dtos);
      const featuredMediaString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.featured_media
      );

      const categoriesString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.categories
      );

     const typePostString = this.mapperService.extractUniqueAsString(
        dtos,
        dto => dto.typepost
      );

      return forkJoin({
        dtos: of(dtos),
        media: this.api.getList('media', featuredMediaString),
        categories: this.api.getList('categories', categoriesString),
        typepost: this.api.getList('typepost', typePostString)
      });


    }),

  tap(({ dtos, media,categories,typepost }) => {
   
      this.posts = this.mapperService.fromPostDtoList(
        dtos,
        media,
        categories,
        typepost
      );
    })

  ).subscribe({
    error: error => {
      console.error('Errore caricamento post', error);
    }
  });
}

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

            this.loadEvents();
            this.loadPublications();
            this.loadPosts();

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