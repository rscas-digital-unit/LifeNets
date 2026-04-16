import { Injectable } from '@angular/core';
import { PeopleDto } from '../../models/api/people-dto.model';
import { EventDto } from '../../models/api/event-dto.model';
import { TaxonomyDto } from '../../models/api/taxonomy-dto.model';

@Injectable({
  providedIn: 'root',
})
export class DecoderService {
  
  
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

decodeHtmlEntities(text: string): string {
  if (!text) {
    return '';
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}
}
