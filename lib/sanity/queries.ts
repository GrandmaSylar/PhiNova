import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    contactEmail,
    contactPhone,
    contactAddress,
    logo { asset->{ url } },
    dayVideoUrl,
    nightVideoUrl,
    dayImage { asset->{ url }, hotspot, crop },
    nightImage { asset->{ url }, hotspot, crop },
    brandNavy,
    brandSteel,
    gaId,
    aboutTitle,
    aboutDescription,
    aboutStoryTitle,
    aboutStoryParagraphs,
    aboutStoryImage { asset->{ url } },
    aboutDifferences[] {
      heading,
      body
    },
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
    heroImage { asset->{ url } },
    problemTitle,
    problemDescription,
    featuresList[] {
      title,
      description
    },
    pricingPlans[] {
      tier,
      price,
      priceAnnual,
      period,
      subtext,
      description,
      popular,
      features
    },
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
    heroSubtitle,
    metaDescription,
    active,
    heroImage { asset->{ url } }
  }
`;

export interface SanitySettings {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  logo?: { asset: { url: string } };
  dayVideoUrl?: string;
  nightVideoUrl?: string;
  dayImage?: { asset: { url: string } };
  nightImage?: { asset: { url: string } };
  brandNavy?: string;
  brandSteel?: string;
  gaId?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutStoryTitle?: string;
  aboutStoryParagraphs?: string[];
  aboutStoryImage?: { asset: { url: string } };
  aboutDifferences?: Array<{
    heading: string;
    body: string;
  }>;
}

export interface SanityProduct {
  productId: string;
  heroTitle?: string;
  heroSubtitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  active?: boolean;
  heroImage?: { asset: { url: string } };
  problemTitle?: string;
  problemDescription?: string;
  featuresList?: Array<{
    title: string;
    description: string;
  }>;
  pricingPlans?: Array<{
    tier: string;
    price: string;
    priceAnnual?: string;
    period?: string;
    subtext?: string;
    description?: string;
    popular?: boolean;
    features?: string[];
  }>;
  screenshots?: Array<{
    asset: { url: string };
    alt?: string;
    caption?: string;
  }>;
}
