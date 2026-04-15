export interface PeopleDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: 'people';
  link: string;
  menu_order: number;
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
    first_name?: string;
    last_name?: string;
    job_title?: string;
    position?: number[];
    area?: number[];
    [key: string]: any;
  };

  tags: number[];
  class_list: string[];

  template: string;

  yoast_head: string;
  yoast_head_json: {
    title: string;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_url: string;
    og_site_name: string;
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
      type: string;
    }>;
    [key: string]: any;
  };

  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:featuredmedia'?: Array<{ href: string; embeddable?: boolean }>;
    curies?: Array<{ name: string; href: string; templated: boolean }>;
    [key: string]: any;
  };
}