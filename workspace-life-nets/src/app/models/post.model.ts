import { CardModel } from './card.model';



export class Post extends CardModel  {
  typePost?: string[];
  
  constructor(
    id: number,
    title: string,
    description: string,
    link: string,
    image?: string,
    categories?: string[],
    typePost?:string[]  ) 
    {
    super(id, title, description, link);

    this.image = image;
    this.categories = categories;
    this.typePost = typePost;
  }

}