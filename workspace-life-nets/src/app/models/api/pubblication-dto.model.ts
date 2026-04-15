export interface PublicationDto {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  template: string;
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

  categories: number[];
  tags: number[];

  class_list: string[];

  acf: {
    'pub-type': string;
    date_issued: string;
    date_accessioned: string;
    authors_string: string;
    editors_string: string;
    authors_relationship: number[] | null;
    editors_relationship: number[] | null;
    doi_uri: string;
    link_cadmus: string;
    link_pdf: string;
    citation: string;
    cadmus_object: string;
    cadmus_uuid: string;

    // ACF può estendersi senza rompere il typing
    [key: string]: any;
  };

  yoast_head: string;

  yoast_head_json: {
    title: string;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_description: string;
    og_url: string;
    og_site_name: string;

    robots: {
      index: string;
      follow: string;
      [key: string]: string;
    };

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
    'acf:post'?: Array<{ href: string; embeddable?: boolean }>;
    'wp:attachment'?: Array<{ href: string }>;
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
