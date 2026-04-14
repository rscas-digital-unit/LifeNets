import { Injectable } from '@angular/core';

import { Event } from '../models/event.model';
import { EventDto } from '../models/api/event-dto.model';
import { PublicationDto } from '../models/api/pubblication-dto.model';
import { Publication } from '../models/publication.model';
import { TaxonomyDto } from '../models/api/taxonomy-dto.model';
import { PostDto } from '../models/api/post-dto.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  fromEventDto(dto: EventDto,eventTypes: TaxonomyDto[],images: TaxonomyDto[]): Event {
    
    return new Event(
      dto.id,
      dto.title?.rendered ?? dto.acf?.title ?? '',
      dto.excerpt?.rendered ?? dto.excerpt?.rendered ?? this.extractPlainTextPreview(dto.content?.rendered ?? ''),
      dto.link,
      this.formatDateShort(dto.date),
      this.decodeIdToName(dto.event_type,eventTypes),
      this.decodeIdToLink(dto.featured_media,images)
    );
  }

  fromEventDtoList(dtos: EventDto[], eventdTypes: TaxonomyDto[], images: TaxonomyDto[]): Event[] {
    return dtos.map(dto => this.fromEventDto(dto,eventdTypes,images));
  }


  
 fromPublicationDto(dto: PublicationDto): Publication {
    return new Publication(
      dto.id,
      dto.title?.rendered ?? '',
      dto.content?.rendered ?? '',
      dto.link
    );
  }

  fromPublicationDtoList(dtos: PublicationDto[]): Publication[] {
    return dtos.map(dto => this.fromPublicationDto(dto));
  }


  fromPostDto(dto: PostDto): Post {
    return new Post(
      dto.id,
      dto.title?.rendered ?? '',
      dto.content?.rendered ?? '',
      dto.link
    );
  }

  fromPostDtoList(dtos: PostDto[]): Post[] {
    return dtos.map(dto => this.fromPostDto(dto));
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

extractUniqueEventsFeaturedMediaAsString(dtos: EventDto[]): string {
  const uniquFeaturedMedia = new Set<number>();

  dtos.forEach(dto => {
     uniquFeaturedMedia.add(dto.featured_media);
  });

  return Array.from(uniquFeaturedMedia).join(',');
}

}