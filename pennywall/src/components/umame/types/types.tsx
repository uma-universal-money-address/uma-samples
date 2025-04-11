/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILink {
  href: string;
  as?: string;
  target?: string;
  name?: string;
}

export type IImage = {
  url: string;
  width: number;
  height: number;
  alt?: string;
  copyright?: string;
  [key: string]: any;
};

export type RichTextField = unknown

export interface ILayout {
  seo: {
    title: string | null;
    description: string | null;
    image: IImage | null;
  };
  cta: {
    label: string | null;
    link: ILink | null;
  };
  navigation?: Array<{
    title: string | null;
    link: ILink | null;
    anchorId?: string;
    icon: IImage | null;
    lottieIcon: string | null;
    ifLocked: boolean | null;
    ifOpen: boolean | null;
    items?: Array<{
      title: string | null;
      link: ILink | null;
      anchorId?: string;
    }>;
  }>;

  partners?: Array<{
    name: string | null;
    logo?: IImage | null;
    link?: ILink | null;
  }>;

  countries?: Array<{
    country: string | null;
  }>;

  modal: {
    title: string | null;
    text: string | null;
    button: string | null;
    placeholder: string | null;
    companyPlaceholder: string | null;
    companyText: RichTextField | null;
  }

  footer: {
    ctaText: string | null;
    ctaLink: ILink | null;
    title?: string | null;
    navigation: Array<{
      title: string;
      link?: ILink;
    }>;
    legal: Array<{
      title: string;
      link?: ILink;
    }>;
    social: Array<{
      title: string;
      link?: ILink;
    }>;
    copyright: RichTextField | null;
  };
}
