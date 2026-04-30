import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { Event } from '../models/event.model';
import { Publication } from '../models/publication.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPayload } from '../models/api/login-payload.model';
import { Post } from '../models/post.model';
import { EventDto } from '../models/api/event-dto.model';
import { PublicationDto } from '../models/api/pubblication-dto.model';
import { TaxonomyDto } from '../models/api/taxonomy-dto.model';
import { PostDto } from '../models/api/post-dto.model';
import { PeopleDto } from '../models/api/people-dto.model';
import { AdvertisingDto } from '../models/api/advertising-dto';
import { PagesDto } from '../models/api/pages-dto.model';

import { APP_EXTERNAL_CONFIG } from '../app.config.token';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private config = inject(APP_EXTERNAL_CONFIG);

 //private projectTagId = 1409; // TEST: 1409 | PROD: 2317




  constructor(private http: HttpClient) {}

 

getPubblications(): Observable<PublicationDto[]> {
  //console.log("TOKEN "+this.token)
  return this.http.get<PublicationDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/publication',
    {
      params: {
        tags: this.config.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET by tag response:', response);
    })
  );

}


getEvents(): Observable<EventDto[]> {
  //console.log('TOKEN', this.token);

  return this.http.get<EventDto[]>(

    this.config.apiBaseUrl+'wp-json/wp/v2/event',
    {
      params: {
        tags: this.config.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET by tag response:', response);
    })
  );

}

getPosts(): Observable<PostDto[]> {
  //console.log("TOKEN "+this.token)
  return this.http.get<PostDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/posts',
    {
      params: {
        tags: this.config.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET by tag response:', response);
    })
  );

}


getAdvertisings():Observable<AdvertisingDto[]> {
  //console.log("TOKEN "+this.token)
  return this.http.get<AdvertisingDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/advertising',
    {
      params: {
        tags: this.config.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET by tag response:', response);
    })
  );

}


getPages():Observable<PagesDto> {
  //console.log("TOKEN "+this.token)
  return this.http.get<PagesDto>(
    this.config.apiBaseUrl+'wp-json/wp/v2/pages/49631',
    {
      params: {
        tags: this.config.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET by pages response:', response);
    })
  );

}


getList(listName:string, include:string): Observable<TaxonomyDto[]>{
  //console.log("TOKEN "+this.token)
  return this.http.get<TaxonomyDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/'+listName,
    {
      params: {
        include: include
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET '+listName+' response:', response);
    })
  );

}


getPeopleList( include:string): Observable<PeopleDto[]>{
  //console.log("TOKEN "+this.token);
  //console.log("INCLUDE "+include);
  return this.http.get<PeopleDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/people',
    {
      params: {
        include: include
      }
    }
  )
.pipe(
    tap(response => {
      //console.log('GET people '+include+' response:', response);
    })
  );

}

}