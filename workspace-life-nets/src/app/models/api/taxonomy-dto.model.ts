export interface TaxonomyDto {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;

  acf: any[];

  meta: any[];
 source_url: string;
  yoast_head: string;

  yoast_head_json: {
    title: string;
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
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
    'wp:post_type'?: Array<{ href: string }>;
    curies?: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;

    [key: string]: any;
  };
}
``