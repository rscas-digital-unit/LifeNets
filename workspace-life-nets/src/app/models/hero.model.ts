export class HeroModel {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;

  constructor(
    title: string,
    description: string,
    buttonText: string,
    buttonLink: string,
    image: string
  ) {
    this.title = title;
    this.description = description;
    this.buttonText = buttonText;
    this.buttonLink = buttonLink;
    this.image = image;
  }
}