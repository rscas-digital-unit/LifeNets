import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  

 private projectTagId = 1409; // TEST: 1409 | PROD: 2317
 private apiBaseUrl = 'https://fsr.eui.eu/';
 private authUrl = 'https://fsr.eui.eu/'; 
 private token = '';

 private readonly technicalUser: LoginPayload = {
    username: 'rscas.webunit@eui.eu',
    password: 'qEFIpu&WPn$HMmU!tUB5En#r'
  };

  constructor(private http: HttpClient) {}

  loginWithTechnicalUser(): Observable<any> {
    return this.http
      .post<any>(this.authUrl+'wp-json/jwt-auth/v1/token', this.technicalUser)
      .pipe(
        tap(response => {
          console.log('POST response:', response);
          this.token = response.token;
          console.log('POST token:', this.token);
        })
      );
  }

  
 
validateToken() {
  return this.http.post(
    this.authUrl+'/wp-json/jwt-auth/v1/token/validate',
    null,
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  );
}

getPubblications(): Observable<PublicationDto[]> {
  console.log("TOKEN "+this.token)
  return this.http.get<PublicationDto[]>(
    this.apiBaseUrl+'wp-json/wp/v2/publication',
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        tags: this.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET by tag response:', response);
    })
  );

}


getEvents(): Observable<EventDto[]> {
  console.log('TOKEN', this.token);

  return this.http.get<EventDto[]>(

    this.apiBaseUrl+'wp-json/wp/v2/event',
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        tags: this.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET by tag response:', response);
    })
  );

}

getPosts(): Observable<PostDto[]> {
  console.log("TOKEN "+this.token)
  return this.http.get<PostDto[]>(
    this.apiBaseUrl+'wp-json/wp/v2/posts',
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        tags: this.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET by tag response:', response);
    })
  );

}


getAdvertisings() {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/advertising',
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        tags: this.projectTagId
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET by tag response:', response);
    })
  );

}


getList(listName:string, include:string): Observable<TaxonomyDto[]>{
  console.log("TOKEN "+this.token)
  return this.http.get<TaxonomyDto[]>(
    this.apiBaseUrl+'wp-json/wp/v2/'+listName,
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
      console.log('GET '+listName+' response:', response);
    })
  );

}


getPeopleList( include:string): Observable<PeopleDto[]>{
  console.log("TOKEN "+this.token)
  return this.http.get<PeopleDto[]>(
    this.apiBaseUrl+'wp-json/wp/v2/people',
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
      console.log('GET people response:', response);
    })
  );

}


getTags(include:string) {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/tags',
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
      console.log('GET tags response:', response);
    })
  );

}

getCategories(include:string) {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/categories',
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
      console.log('GET categories response:', response);
    })
  );

}


getPeople(id:string) {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/people/'+id,
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET people response:', response);
    })
  );

}


getMedia(id:string) {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/media/'+id,
    {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  )
.pipe(
    tap(response => {
      console.log('GET media response:', response);
    })
  );

}





getEventType(include:string) {
  console.log("TOKEN "+this.token)
  return this.http.get(
    this.apiBaseUrl+'wp-json/wp/v2/event_type',
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
      console.log('GET event_type response:', response);
    })
  );

}


/* PROVVISORIO */
/*
private events: Event[] = [
  new Event(1, 'Angular Meetup', 'Angular community meetup', '/events/angular-meetup'),
  new Event(2, 'Frontend Conference', 'Frontend development conference', '/events/frontend-conference'),
  new Event(3, 'UI/UX Workshop', 'UI and UX hands-on workshop', '/events/ui-ux-workshop'),
  new Event(4, 'TypeScript Day', 'Deep dive into TypeScript', '/events/typescript-day'),
  new Event(5, 'Web Performance Talk', 'Web performance best practices', '/events/web-performance'),
  new Event(6, 'Accessibility Seminar', 'Web accessibility seminar', '/events/accessibility'),
  new Event(7, 'RxJS Deep Dive', 'Advanced RxJS concepts', '/events/rxjs-deep-dive'),
  new Event(8, 'Angular Signals Intro', 'Introduction to Angular Signals', '/events/angular-signals'),
  new Event(9, 'Testing Strategies', 'Frontend testing strategies', '/events/testing-strategies'),
  new Event(10, 'Micro Frontends', 'Micro frontend architectures', '/events/micro-frontends'),
  new Event(11, 'State Management', 'Managing state in large apps', '/events/state-management'),
  new Event(12, 'Enterprise Angular', 'Angular for enterprise applications', '/events/enterprise-angular')
];

private publications: Publication[] = [
  new Publication(101, 'Angular Best Practices', 'Best practices for Angular projects', '/publications/angular-best-practices'),
  new Publication(102, 'Clean Code Frontend', 'Clean code applied to frontend', '/publications/clean-code-frontend'),
  new Publication(103, 'Scaling Angular Apps', 'Scaling techniques for Angular', '/publications/scaling-angular'),
  new Publication(104, 'TypeScript Advanced Types', 'Advanced TypeScript typing', '/publications/typescript-advanced-types'),
  new Publication(105, 'RxJS Patterns', 'Common RxJS patterns', '/publications/rxjs-patterns'),
  new Publication(106, 'Web Accessibility Guide', 'Accessibility guidelines for the web', '/publications/web-accessibility'),
  new Publication(107, 'Frontend Architecture', 'Frontend architecture principles', '/publications/frontend-architecture'),
  new Publication(108, 'Testing Angular', 'How to test Angular applications', '/publications/testing-angular'),
  new Publication(109, 'Performance Optimization', 'Frontend performance optimization', '/publications/performance-optimization'),
  new Publication(110, 'State Management Explained', 'State management concepts', '/publications/state-management'),
  new Publication(111, 'Angular Signals', 'Understanding Angular Signals', '/publications/angular-signals'),
  new Publication(112, 'Modern Web UI', 'Modern web UI approaches', '/publications/modern-web-ui')
];

private posts: Post[] = [
  new Post(201, 'Angular Best Practices', 'Angular development tips', '/posts/angular-best-practices'),
  new Post(202, 'Clean Code Frontend', 'Clean code for frontend developers', '/posts/clean-code-frontend'),
  new Post(203, 'Scaling Angular Apps', 'How to scale Angular apps', '/posts/scaling-angular'),
  new Post(204, 'TypeScript Advanced Types', 'Using advanced TypeScript types', '/posts/typescript-advanced-types'),
  new Post(205, 'RxJS Patterns', 'Effective RxJS usage patterns', '/posts/rxjs-patterns'),
  new Post(206, 'Web Accessibility Guide', 'Accessibility on the modern web', '/posts/web-accessibility'),
  new Post(207, 'Frontend Architecture', 'Designing frontend architectures', '/posts/frontend-architecture'),
  new Post(208, 'Testing Angular', 'Testing strategies in Angular', '/posts/testing-angular'),
  new Post(209, 'Performance Optimization', 'Optimizing frontend performance', '/posts/performance-optimization'),
  new Post(210, 'State Management Explained', 'State management fundamentals', '/posts/state-management'),
  new Post(211, 'Angular Signals', 'Working with Angular Signals', '/posts/angular-signals'),
  new Post(212, 'Modern Web UI', 'Modern UI development techniques', '/posts/modern-web-ui')
];*/
/*
  readEvents(): Observable<Event[]> {
    return of(this.events);
  }

  readPublications(): Observable<Publication[]> {
    return of(this.publications);
  }

  readPosts(): Observable<Post[]> {
    return of(this.posts);
  }*/
}