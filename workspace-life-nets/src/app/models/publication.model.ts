import { CardModel } from './card.model';
import { People } from './people.model';


export class Publication extends CardModel {

  pubType?: string;
  people?: People[];

  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    image?: string,
    tags?: string[],
    categories?: string[],
    pubType?: string,
    people?: People[]
  ) {
    super(id, title, description, link);
    this.image = image;
    this.tags = tags;
    this.categories = categories;
    this.pubType = pubType;
    this.people = people;
  }

}