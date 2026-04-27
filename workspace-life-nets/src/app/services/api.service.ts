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
 //private apiBaseUrl = 'https://fsr.eui.eu/';
 //private authUrl = 'https://fsr.eui.eu/'; 
 private token = '';

 
 private readonly technicalUser: LoginPayload = {
    username: this.config.username, //'rscas.webunit@eui.eu',
    password: this.config.password   //'qEFIpu&WPn$HMmU!tUB5En#r'
  };

  constructor(private http: HttpClient) {}

 

  loginWithTechnicalUser(): Observable<any> {
    return this.http
      .post<any>(this.config.authUrl+'wp-json/jwt-auth/v1/token', this.technicalUser)
      .pipe(
        tap(response => {
          //console.log('POST response:', response);
          this.token = response.token;
          //console.log('POST token:', this.token);
        })
      );
  }

  
 
validateToken() {
  return this.http.post(
    this.config.authUrl+'/wp-json/jwt-auth/v1/token/validate',
    null,
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  );
}

getPubblications(): Observable<PublicationDto[]> {
  //console.log("TOKEN "+this.token)
  return this.http.get<PublicationDto[]>(
    this.config.apiBaseUrl+'wp-json/wp/v2/publication',
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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
      headers: {
        Authorization: `Bearer ${this.token}`
      },
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