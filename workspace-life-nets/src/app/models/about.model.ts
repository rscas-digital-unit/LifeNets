export class AboutTabModel {
  id: number;
  label: string;
  content: string; 

  constructor(id: number, label: string,content: string ){
        this.id=id;
        this.label=label;
        this.content=content;
  }
}

export class AboutModel {
  content: string;
  left_text: string;
  right_text: string;
  tabs: AboutTabModel[];

   constructor(content: string, left_text: string, right_text: string, tabs: AboutTabModel[] ){
        this.content=content;
        this.left_text=left_text;
        this.right_text=right_text;
        this.tabs=tabs;
  }
}
