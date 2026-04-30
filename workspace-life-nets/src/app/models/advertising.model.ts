export class Advertising
 {
  id: number;
  title: string;
  description: string;
  label : string;
  link: string;
  image?: string;


  constructor(
    id: number,
    title: string,
    description: string,
    label: string,
    link: string,
    image: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.label = label;
    this.link = link;
    this.image = image;

  }
}
