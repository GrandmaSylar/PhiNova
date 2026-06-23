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

    // ── Hero image (for product overview cards) ──────────────────────
    defineField({
      name: "heroImage",
      title: "Card Thumbnail",
      type: "image",
      description: "Shown on the /products overview page and product hero section.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "productId", subtitle: "heroTitle" },
    prepare({ title, subtitle }) {
      return { title: PRODUCT_IDS.find((p) => p.value === title)?.title ?? title, subtitle };
    },
  },
});
