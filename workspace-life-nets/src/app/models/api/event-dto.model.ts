export interface EventDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  featured_media: number;
  tags: number[];
  template: string;
  event_type: number;

  title: {
    rendered: string;
  };

  content: {
    rendered: string;
  };

  excerpt: {
    rendered: string;
  };

  guid: {
    rendered: string;
  };

  acf: {
    title: string;
    description: string;
    cta_link: string;
    cta_email: string;
    cta_label: string;
    // altri campi ACF opzionali
    [key: string]: any;
  };

  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:featuredmedia'?: Array<{ href: string }>;
    [key: string]: any;
  };
}
``