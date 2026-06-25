import { defineField, defineType } from "sanity";

const PRODUCT_IDS = [
  { title: "Invitro LIMS", value: "invitro" },
  { title: "COCM", value: "cocm" },
  { title: "Concord SMS", value: "concord" },
];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "productId",
      title: "Product",
      type: "string",
      options: { list: PRODUCT_IDS },
      validation: (R) => R.required(),
    }),
    defineField({ name: "active", title: "Publicly visible", type: "boolean", initialValue: true }),

    // ── Hero copy ────────────────────────────────────────────────────
    defineField({ name: "heroTitle", title: "Hero Title", type: "string", description: "Overrides the hardcoded h1." }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text", rows: 3 }),

    // ── SEO ──────────────────────────────────────────────────────────
    defineField({ name: "metaTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "metaDescription", title: "SEO Description", type: "text", rows: 2 }),

    // ── Screenshots ──────────────────────────────────────────────────
    defineField({
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      description: "First image is the large hero screenshot; remaining appear in the scrollable strip.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text / Slot label", type: "string", validation: (R) => R.required() }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
          ],
        },
      ],
    }),

    defineField({
      name: "heroImage",
      title: "Card Thumbnail",
      type: "image",
      description: "Shown on the /products overview page and product hero section.",
      options: { hotspot: true },
    }),

    // ── Problem statement ────────────────────────────────────────────
    defineField({ name: "problemTitle", title: "Problem Section Title", type: "string" }),
    defineField({ name: "problemDescription", title: "Problem Section Description", type: "text", rows: 4 }),

    // ── Key Features ─────────────────────────────────────────────────
    defineField({
      name: "featuresList",
      title: "Key Features",
      type: "array",
      description: "Customize the key features section (typically 6 items). Icons are predefined per product.",
      of: [
        {
          type: "object",
          name: "feature",
          title: "Feature",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (R) => R.required() }),
          ],
        },
      ],
    }),

    // ── Pricing Plans ────────────────────────────────────────────────
    defineField({
      name: "pricingPlans",
      title: "Pricing Plans",
      type: "array",
      of: [
        {
          type: "object",
          name: "plan",
          title: "Pricing Plan",
          fields: [
            defineField({ name: "tier", title: "Tier Name", type: "string", validation: (R) => R.required() }),
            defineField({ name: "price", title: "Price (Monthly)", type: "string", description: "e.g. GH₵499, Custom", validation: (R) => R.required() }),
            defineField({ name: "priceAnnual", title: "Annual Price (Billed Annually)", type: "string", description: "e.g. GH₵399, Custom, or leave blank if not applicable" }),
            defineField({ name: "period", title: "Period", type: "string", description: "e.g. /mo, /yr, or leave blank" }),
            defineField({ name: "subtext", title: "Subtext / Limits", type: "string", description: "e.g. Up to 3 users, or 1,000 tests/mo" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2, description: "Mainly used for Concord SMS cards" }),
            defineField({ name: "popular", title: "Mark as Popular", type: "boolean", initialValue: false }),
            defineField({
              name: "features",
              title: "Features List",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "productId", subtitle: "heroTitle" },
    prepare({ title, subtitle }) {
      return { title: PRODUCT_IDS.find((p) => p.value === title)?.title ?? title, subtitle };
    },
  },
});
