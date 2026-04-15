import { CardModel } from './card.model';
import { PeopleModel } from './people.model';


export class Publication extends CardModel {

  pubType?: string;
  people?: PeopleModel[];

  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    image?: string,
    tags?: string[],
    categories?: string[],
    pubType?: string,
    people?: PeopleModel[]
  ) {
    super(id, title, description, link);
    this.image = image;
    this.tags = tags;
    this.categories = categories;
    this.pubType = pubType;
    this.people = people;
  }

}