export const SITE_NAME = 'Black Red White';
export const SITE_LEGAL_NAME = 'ООО «Артамид»';
export const SITE_PHONE = '+375296226767';
export const SITE_PHONE_LABEL = '+375 29 622 67 67';
export const SITE_CURRENCY = 'BYN';
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/blackredwhite__belarus/';
export const SITE_INSTAGRAM_HANDLE = '@blackredwhite__belarus';

export interface SiteStore {
  id: 'nepokorennykh';
  phone: string;
  phoneLabel: string;
  mapEmbedUrl: string;
}

export const SITE_STORES: readonly SiteStore[] = [
  {
    id: 'nepokorennykh',
    phone: SITE_PHONE,
    phoneLabel: SITE_PHONE_LABEL,
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9327.26563723417!2d30.326682639113066!3d53.87651113445286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46d051862f45be4d%3A0x8c14862eebdeebb7!2sRio!5e0!3m2!1sen!2sru!4v1791756186864!5m2!1sen!2sru',
  },
];
