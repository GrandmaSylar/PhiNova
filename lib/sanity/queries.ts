import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    contactEmail,
    dayVideoUrl,
    nightVideoUrl,
    dayImage { asset->{ url }, hotspot, crop },
    nightImage { asset->{ url }, hotspot, crop },
    brandNavy,
    brandSteel,
    gaId,
  }
`;

export const PRODUCT_QUERY = groq`
  *[_type == "product" && productId == $productId][0] {
    productId,
    heroTitle,
    heroSubtitle,
    metaTitle,
    metaDescription,
    active,
    screenshots[] {
      asset->{ url },
      alt,
      caption
    }
  }
`;

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt asc) {
    productId,
    heroTitle,
    active
  }
`;

export interface SanitySettings {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  dayVideoUrl?: string;
  nightVideoUrl?: string;
  dayImage?: { asset: { url: string } };
  nightImage?: { asset: { url: string } };
  brandNavy?: string;
  brandSteel?: string;
  gaId?: string;
}

export interface SanityProduct {
  productId: string;
  heroTitle?: string;
  heroSubtitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  active?: boolean;
  screenshots?: Array<{
    asset: { url: string };
    alt?: string;
    caption?: string;
  }>;
}
