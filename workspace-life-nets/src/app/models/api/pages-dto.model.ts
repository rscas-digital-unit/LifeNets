export interface PagesDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: 'page';
  link: string;
  template: string;
  menu_order: number;
  parent: number;
  author: number;
  featured_media: number;

  title: {
    rendered: string;
  };

  content: {
    rendered: string;
    protected: boolean;
  };

  excerpt: {
    rendered: string;
    protected: boolean;
  };

  guid: {
    rendered: string;
  };

 acf: {
  hero: {
    title: string;
    description: string;
    button_link: string;
    button_link_text: string;
  };
  about_page: {
    left_text: string;
    right_text: string;
    content: string;
    tabs: unknown[];
  };
}


  class_list: string[];

  meta: {
    _acf_changed?: boolean;
    footnotes?: string;
    [key: string]: any;
  };

  yoast_head: string;
  yoast_head_json: any;

  _links: any;
}