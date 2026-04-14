export abstract class CardModel {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  date?: string;
  meta?: any;

  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.link = link;
    
  }
}