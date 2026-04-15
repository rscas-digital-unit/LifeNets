import { CardModel } from './card.model';


export class Post extends CardModel  {

  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    image?: string
  ) {
    super(id, title, description, link);

    this.image = image;
  }

}