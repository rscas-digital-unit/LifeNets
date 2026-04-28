import { inject, Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { Event } from '../models/event.model';
import { Publication } from '../models/publication.model';
import { Post } from '../models/post.model';
import { CardModel } from '../models/card.model';

import { forkJoin, of, switchMap, tap } from 'rxjs';

import { Advertising } from '../models/advertising.model';
import { MapperService } from './mappers/mapper-service';
import { DecoderService } from './mappers/decoder-service';
import { HeroModel } from '../models/hero.model';
import { PagesDto } from '../models/api/pages-dto.model';
import { AboutModel } from '../models/about.model';
import { HeaderModel } from '../models/header.model';
import { APP_EXTERNAL_CONFIG } from '../app.config.token';

@Injectable({
  providedIn: 'root'
})
export class ItemsRepositoryService {
    config = inject(APP_EXTERNAL_CONFIG);
  private events: Event[] = [];
  private publications: Publication[] = [];
  private posts: Post[] = [];
  private advertisings: Advertising[] = [];
  private about: AboutModel = new AboutModel("","","",[]);
  private hero: HeroModel= new HeroModel(
    'LIFE NETS',
    '',
    '',
    '',
    this.config.defaultImage
  ) 

  
 private currentPage:string = "Landing";

  constructor(private api: ApiService, private mapperService: MapperService, private decoderService: DecoderService) {
   }

  goToPage(pageName:string){
    this.currentPage = pageName;
  }

loadPages(){
  this.api.getPages().pipe(
  switchMap(dto => {

    const featuredMediaString = this.decoderService.extractUniqueAsString(
      [dto],
      (page: PagesDto) => page.featured_media
    );
    return forkJoin({
      dto: of(dto),
      media: this.api.getList('media', featuredMediaString)
    });
  }),

  tap(({ dto,  media }) => {
    this.hero = this.mapperService.fromPagesDtoToHero(dto,  media);
    this.about = this.mapperService.fromPagesDtoToAbout(dto);
  })

).subscribe({
  error: error => {
    console.error('Errore caricamento hero', error);
  }
});

}

loadEvents(){
  this.api.getEvents().pipe(

  switchMap(dtos => {
    const typesString = this.decoderService.extractUniqueAsString(
      dtos,
      dto => dto.event_type
    );

    const featuredMediaString = this.decoderService.extractUniqueAsString(
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


loadAdvertisings(){
  this.api.getAdvertisings().pipe(

  switchMap(dtos => {


    const featuredMediaString = this.decoderService.extractUniqueAsString(
      dtos,
      dto => dto.featured_media
    );

    return forkJoin({
      dtos: of(dtos),
      media: this.api.getList('media', featuredMediaString)
    });
  }),

  tap(({ dtos, media }) => {
    this.advertisings = this.mapperService.fromAdvertisingDtoList(dtos,  media);
  })

).subscribe({
  error: error => {
    console.error('Errore caricamento advertising', error);
  }
});

}


loadPublications(): void {
  this.api.getPubblications().pipe(

    // 🔹 Primo stadio: carico publications + decodifiche dirette
    switchMap(dtos => {

      const featuredMediaString = this.decoderService.extractUniqueAsString(
        dtos,
        dto => dto.featured_media
      );

      const featuredTagsString = this.decoderService.extractUniqueAsString(
        dtos,
        dto => dto.tags
      );

      const featuredCategoriesString = this.decoderService.extractUniqueAsString(
        dtos,
        dto => dto.categories
      );

      const peopleIdsString = this.decoderService.extractUniqueAsString(
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

      const peopleMediaString = this.decoderService.extractPeopleFeaturedMediaAsString(
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
      //console.log("POST DTO");
      //console.log(dtos);
      const featuredMediaString = this.decoderService.extractUniqueAsString(
        dtos,
        dto => dto.featured_media
      );

      const categoriesString = this.decoderService.extractUniqueAsString(
        dtos,
        dto => dto.categories
      );

     const typePostString = this.decoderService.extractUniqueAsString(
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
    if(this.events.length>0 && this.posts.length>0 && this.publications.length>0){
      return;
    }
    this.api.loginWithTechnicalUser()
      .subscribe({
        next: response => {
          //console.log('Login tecnico effettuato');
          this.api.validateToken()
            .subscribe({
              next: response => {
                //console.log('Validate toker effettuato');
              },
              error: error => {
                console.error('Errore Validate toker', error);
              }
            });
            this.loadPages();
            this.loadEvents();
            this.loadPublications();
            this.loadPosts();
            this.loadAdvertisings();

        },
        error: error => {
          console.error('Errore login tecnico', error);
        }
      });


  }

   getHeader(): HeaderModel  {
    if(this.currentPage ==="Landing"){
        return new HeaderModel(this.hero.title,this.hero.description,  this.hero.image);
    }else if(this.currentPage ==="About"){
        return new HeaderModel("About","",  this.hero.image);
    }
    return new HeaderModel("LIFE NETS","",  this.hero.image);
  }
   
  getHero(): HeroModel  {
    return this.hero;
  }

  getAbout(): AboutModel  {
    return this.about;
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

  getAdvertisings(): Advertising[] {
    return this.advertisings;
  }

}