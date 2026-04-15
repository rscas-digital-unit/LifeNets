import { Injectable } from '@angular/core';

import { Event } from '../models/event.model';
import { EventDto } from '../models/api/event-dto.model';
import { PublicationDto } from '../models/api/pubblication-dto.model';
import { Publication } from '../models/publication.model';
import { TaxonomyDto } from '../models/api/taxonomy-dto.model';
import { PostDto } from '../models/api/post-dto.model';
import { Post } from '../models/post.model';
import { PeopleDto } from '../models/api/people-dto.model';
import { PeopleModel } from '../models/people.model';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  fromEventDto(dto: EventDto,eventTypes: TaxonomyDto[],images: TaxonomyDto[]): Event {
    
    return new Event(
      dto.id,
      dto.title?.rendered ?? dto.acf?.title ?? '',
      this.extractPlainTextPreview(dto.excerpt?.rendered) ?? this.extractPlainTextPreview(dto.content?.rendered ?? ''),
      dto.link,
      this.formatDateShort(dto.date),
      this.decodeIdToName(dto.event_type,eventTypes),
      this.decodeIdToLink(dto.featured_media,images)
    );
  }

  fromEventDtoList(dtos: EventDto[], eventdTypes: TaxonomyDto[], images: TaxonomyDto[]): Event[] {
    return dtos.map(dto => this.fromEventDto(dto,eventdTypes,images));
  }

fromPublicationDto(
  dto: PublicationDto,
  images: TaxonomyDto[],
  tags: TaxonomyDto[],
  categories: TaxonomyDto[],
  people: PeopleDto[],
  peopleMedia: TaxonomyDto[]
): Publication {

  const relatedPeopleIds = [
    ...(dto.acf.authors_relationship ?? []),
    ...(dto.acf.editors_relationship ?? [])
  ];

  const peopleModels = this.buildPeopleModels(
    people,
    relatedPeopleIds,
    peopleMedia
  );

  return new Publication(
    dto.id,
    dto.title?.rendered ?? '',
    this.extractPlainTextPreview(dto.excerpt?.rendered)
      ?? this.extractPlainTextPreview(dto.content?.rendered ?? ''),
    dto.link,
    this.decodeIdToLink(dto.featured_media, images),
    this.decodeIdsToNames(dto.tags, tags),
    this.decodeIdsToNames(dto.categories, categories),
    dto.acf['pub-type'],
    peopleModels
  );
}

  fromPublicationDtoList(dtos: PublicationDto[],images: TaxonomyDto[], tags: TaxonomyDto[], categories: TaxonomyDto[], people:PeopleDto[], peopleMedia:TaxonomyDto[]): Publication[] {
    return dtos.map(dto => this.fromPublicationDto(dto, images, tags, categories, people, peopleMedia));
  }


  fromPostDto(dto: PostDto,images: TaxonomyDto[], categories: TaxonomyDto[], typespost: TaxonomyDto[]): Post {
    
    return new Post(
      dto.id,
      dto.title?.rendered ?? '',
      this.extractPlainTextPreview(dto.excerpt?.rendered) ?? this.extractPlainTextPreview(dto.content?.rendered ?? ''),
      dto.link,
      this.decodeIdToLink(dto.featured_media,images),
      this.decodeIdsToNames(dto.categories, categories),
      this.decodeIdsToNames(dto.typepost, typespost),
    );
  }

  fromPostDtoList(dtos: PostDto[],images: TaxonomyDto[], categories: TaxonomyDto[], typespost: TaxonomyDto[]): Post[] {
    return dtos.map(dto => this.fromPostDto(dto, images, categories,typespost));
  }
  


  buildPeopleModels(
  people: PeopleDto[],
  relatedPeopleIds: number[],
  peopleMedia: TaxonomyDto[]
): PeopleModel[] {

  const idsSet = new Set<number>(relatedPeopleIds);

  const peopleModels: PeopleModel[] = people
    .filter(person => idsSet.has(person.id))
    .map(person => {

      const fullName = [
        person.acf?.first_name,
        person.acf?.last_name
      ]
        .filter(Boolean)
        .join(' ');

      const imageLink = this.decodeIdToLink(
        person.featured_media,
        peopleMedia
      );

      const model = new PeopleModel(
        person.id,
        fullName,
        imageLink
      );
      return model;
    });

  return peopleModels;
}

decodeIdsToNames(
  ids: Array<number | string>,
  taxonomy: TaxonomyDto[]
): string[] {
  return ids
    .map(id => {
      const numericId = Number(id);
      const match = taxonomy.find(type => type.id === numericId);
      return match ? match.name : '';
    })
    .filter(name => name !== '');
}


decodeIdToName(id: number | string, taxonomy: TaxonomyDto[]): string {
  const numericId = Number(id);
  const match = taxonomy.find(type => type.id === numericId);
  return match ? match.name : '';
}

decodeIdToLink(id: number | string, taxonomy: TaxonomyDto[]): string {
  const numericId = Number(id);
  const match = taxonomy.find(type => type.id === numericId);
  return match ? match.link : '';
}


  formatDateShort(dateIso: string): string {
  const date = new Date(dateIso);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}


 extractPlainTextPreview(
  html: string,
  maxLength = 150
): string {
  if(!html) return html;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const text = (tempDiv.textContent || '').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  const cut = text.slice(0, maxLength);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

 extractUniqueTagsAsString(dtos: EventDto[]): string {
  const uniqueTags = new Set<number>();

  dtos.forEach(dto => {
    dto.tags?.forEach(tag => uniqueTags.add(tag));
  });

  return Array.from(uniqueTags).join(', ');
}

 extractUniqueEventsTypesAsString(dtos: EventDto[]): string {
  const uniqueEventsTypes = new Set<number>();

  dtos.forEach(dto => {
     uniqueEventsTypes.add(dto.event_type);
  });

  return Array.from(uniqueEventsTypes).join(',');
}


extractPeopleFeaturedMediaAsString(people: PeopleDto[]): string {
  const uniqueMedia = new Set<number>();

  people.forEach(person => {
    if (typeof person.featured_media === 'number' && person.featured_media > 0) {
      uniqueMedia.add(person.featured_media);
    }
  });

  return Array.from(uniqueMedia).join(',');
}

extractUniqueAsString<T>(
  items: T[],
  selector: (item: T) => number | number[] | null | undefined
): string {
  const uniqueValues = new Set<number>();

  items.forEach(item => {
    const value = selector(item);

    if (Array.isArray(value)) {
      value.forEach(v => {
        if (typeof v === 'number') {
          uniqueValues.add(v);
        }
      });
    } else if (typeof value === 'number') {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues).join(',');
}

}