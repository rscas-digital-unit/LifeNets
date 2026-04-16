export class Advertising
 {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;


  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    image: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.link = link;
    this.image = image;
    
  }
}