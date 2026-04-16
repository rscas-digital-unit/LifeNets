export interface AdvertisingDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: 'advertising';
  link: string;
  template: string;
  featured_media: number;

  title: {
    rendered: string;
  };

  guid: {
    rendered: string;
  };

  tags: number[];

  acf: {
    title: string;
    description: string;
    cta_label: string;
    cta_link: string;
    cta_email: string;
    pages_associated: number[];

    [key: string]: any;
  };

  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'acf:post'?: Array<{ href: string; embeddable?: boolean }>;
    'wp:featuredmedia'?: Array<{ href: string; embeddable?: boolean }>;
    curies?: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;

    [key: string]: any;
  };
}