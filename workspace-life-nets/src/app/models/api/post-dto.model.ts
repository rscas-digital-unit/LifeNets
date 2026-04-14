export interface PostDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  author: number;
  sticky: boolean;
  template: string;
  featured_media: number;
  format: string;

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

  comment_status: string;
  ping_status: string;

  categories: number[];
  tags: number[];
  typepost: number[];
  tom_keywords: any[];

  class_list: string[];

  meta: {
    _acf_changed?: boolean;
    footnotes?: string;
    [key: string]: any;
  };

  acf: any[]; // vuoto nel tuo caso, lasciato generico

  yoast_head: string;

  yoast_head_json: {
    title: string;
    description?: string;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_description?: string;
    og_url: string;
    og_site_name: string;

    article?: {
      published_time?: string;
      modified_time?: string;
    };

    og_image?: Array<{
      url: string;
      width: number;
      height: number;
      type: string;
    }>;

    robots: {
      index: string;
      follow: string;
      [key: string]: string;
    };

    [key: string]: any;
  };

  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author?: Array<{ href: string; embeddable?: boolean }>;
    replies?: Array<{ href: string; embeddable?: boolean }>;
    'wp:featuredmedia'?: Array<{ href: string; embeddable?: boolean }>;
    'wp:term'?: Array<{
      taxonomy: string;
      href: string;
      embeddable?: boolean;
    }>;
    curies?: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;

    [key: string]: any;
  };
}