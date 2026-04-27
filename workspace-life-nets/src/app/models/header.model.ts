export class HeaderModel {
  title: string;
  description: string;
  image: string;

  constructor(
    title: string,
    description: string,
    image: string
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
  }
}