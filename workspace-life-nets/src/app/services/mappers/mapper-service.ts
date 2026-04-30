import { Injectable } from '@angular/core';

import { Event } from '../../models/event.model';
import { EventDto } from '../../models/api/event-dto.model';
import { PublicationDto } from '../../models/api/pubblication-dto.model';
import { Publication } from '../../models/publication.model';
import { TaxonomyDto } from '../../models/api/taxonomy-dto.model';
import { PostDto } from '../../models/api/post-dto.model';
import { Post } from '../../models/post.model';
import { PeopleDto } from '../../models/api/people-dto.model';
import { People } from '../../models/people.model';
import { DecoderService } from './decoder-service';
import { Advertising } from '../../models/advertising.model';
import { AdvertisingDto } from '../../models/api/advertising-dto';
import { PagesDto } from '../../models/api/pages-dto.model';
import { HeroModel } from '../../models/hero.model';
import { AboutModel, AboutTabModel } from '../../models/about.model';

@Injectable({
  providedIn: 'root'
})
export class MapperService {



  constructor(private decoderService: DecoderService) { }

fromPagesDtoToAbout(dtos: PagesDto): AboutModel  {
    const tabs: AboutTabModel[] = dtos.acf.about_page.tabs.map(
  (tabDto, index) =>
    new AboutTabModel(
      index,
      tabDto.label,
      tabDto.text
    )
);
    return new AboutModel(
      dtos.acf.about_page.content,
       dtos.acf.about_page.left_text,
       dtos.acf.about_page.right_text,
       tabs
    );
  }


fromPagesDtoToHero(dtos: PagesDto, media: TaxonomyDto[]): HeroModel  {
     return new HeroModel(
      dtos.acf.hero.title,
       dtos.acf.hero.description,
       dtos.acf.hero.button_link_text,
       dtos.acf.hero.button_link,
      this.decoderService.decodeIdToSourceurl(dtos.featured_media,media)
    );
  }

 fromAdvertisingDto(dto: AdvertisingDto, images: TaxonomyDto[]): Advertising {

    return new Advertising(
      dto.id,
      this.decoderService.decodeHtmlEntities(dto.acf.title) ?? '',
      this.decoderService.extractPlainTextPreview(dto.acf.description) ??  '',
      this.decoderService.decodeHtmlEntities(dto.acf.cta_label) ?? '',
      dto.link,
      this.decoderService.decodeIdToLink(dto.featured_media,images)
    );

  }

 fromAdvertisingDtoList(dtos: AdvertisingDto[], images: TaxonomyDto[]): Advertising[] {
    return dtos.map(dto => this.fromAdvertisingDto(dto,images));
  }

  fromEventDto(dto: EventDto,eventTypes: TaxonomyDto[],images: TaxonomyDto[]): Event {

    return new Event(
      dto.id,
      this.decoderService.decodeHtmlEntities(dto.title?.rendered) ?? this.decoderService.decodeHtmlEntities(dto.acf?.title) ?? '',
      this.decoderService.extractPlainTextPreview(dto.excerpt?.rendered) ?? this.decoderService.extractPlainTextPreview(dto.content?.rendered ?? ''),
      dto.link,
      this.decoderService.formatDateShort(dto.date),
      this.decoderService.decodeIdToName(dto.event_type,eventTypes),
      this.decoderService.decodeIdToLink(dto.featured_media,images)
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
    this.decoderService.decodeHtmlEntities(dto.title?.rendered) ?? '',
    this.decoderService.extractPlainTextPreview(dto.excerpt?.rendered)
      ?? this.decoderService.extractPlainTextPreview(dto.content?.rendered ?? ''),
    dto.link,
    this.decoderService.decodeIdToLink(dto.featured_media, images),
    this.decoderService.decodeIdsToNames(dto.tags, tags),
    this.decoderService.decodeIdsToNames(dto.categories, categories),
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
      this.decoderService.decodeHtmlEntities(dto.title?.rendered) ?? '',
      this.decoderService.extractPlainTextPreview(dto.excerpt?.rendered) ?? this.decoderService.extractPlainTextPreview(dto.content?.rendered ?? ''),
      dto.link,
      this.decoderService.decodeIdToLink(dto.featured_media,images),
      this.decoderService.decodeIdsToNames(dto.categories, categories),
      this.decoderService.decodeIdsToNames(dto.typepost, typespost),
    );
  }

  fromPostDtoList(dtos: PostDto[],images: TaxonomyDto[], categories: TaxonomyDto[], typespost: TaxonomyDto[]): Post[] {
    return dtos.map(dto => this.fromPostDto(dto, images, categories,typespost));
  }



  buildPeopleModels(
  people: PeopleDto[],
  relatedPeopleIds: number[],
  peopleMedia: TaxonomyDto[]
): People[] {

  const idsSet = new Set<number>(relatedPeopleIds);

  const peopleModels: People[] = people
    .filter(person => idsSet.has(person.id))
    .map(person => {

      const fullName = [
        person.acf?.first_name,
        person.acf?.last_name
      ]
        .filter(Boolean)
        .join(' ');

      const imageLink = this.decoderService.decodeIdToLink(
        person.featured_media,
        peopleMedia
      );

      const model = new People(
        person.id,
        fullName,
        imageLink
      );
      return model;
    });

  return peopleModels;
}


}
