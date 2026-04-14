import { CardModel } from './card.model';


export class Event extends CardModel {

   eventType?: string;

  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    date?: string,
    eventType?: string,
    image?: string
  ) {
    super(id, title, description, link);
    this.date = date;
    this.eventType = eventType;
    this.image = image;
  }

}
