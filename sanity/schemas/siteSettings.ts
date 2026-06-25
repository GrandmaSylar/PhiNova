import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", initialValue: "PhiNova" }),
    defineField({
      name: "logo",
      title: "Logo Image",
      type: "image",
      description: "Upload a logo image to replace the default PN monogram.",
      options: { hotspot: true },
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string", initialValue: "Architecting Digital Solutions" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact Phone", type: "string", description: "e.g. +233 00 000 0000" }),
    defineField({ name: "contactAddress", title: "Contact Address", type: "text", rows: 2 }),
    defineField({ name: "gaId", title: "Google Analytics ID", type: "string", description: "G-XXXXXXXXXX" }),

    // ── Backgrounds ─────────────────────────────────────────────────
    defineField({
      name: "dayVideoUrl",
      title: "Day Mode Video URL",
      type: "url",
      description: "Direct .mp4 URL shown in day mode. Leave blank to use default.",
    }),
    defineField({
      name: "nightVideoUrl",
      title: "Night Mode Video URL",
      type: "url",
      description: "Direct .mp4 URL shown in night mode. Leave blank to use default.",
    }),
    defineField({
      name: "dayImage",
      title: "Day Mode Background Image",
      type: "image",
      description: "Used as poster fallback or if no video URL is set.",
      options: { hotspot: true },
    }),
    defineField({
      name: "nightImage",
      title: "Night Mode Background Image",
      type: "image",
      description: "Used as poster fallback or if no video URL is set.",
      options: { hotspot: true },
    }),

    // ── Brand colours ───────────────────────────────────────────────
    defineField({ name: "brandNavy", title: "Brand Navy (hex)", type: "string", description: "e.g. #1B2C4F" }),
    defineField({ name: "brandSteel", title: "Brand Steel (hex)", type: "string", description: "e.g. #6E97C0" }),

    // ── About Page Content ──────────────────────────────────────────
    defineField({
      name: "aboutTitle",
      title: "About Page Hero Title",
      type: "string",
      description: "e.g. We build systems that institutions can trust",
    }),
    defineField({
      name: "aboutDescription",
      title: "About Page Hero Description",
      type: "text",
      rows: 3,
      description: "Introductory paragraph under the hero title.",
    }),
    defineField({
      name: "aboutStoryTitle",
      title: "About Page Story Section Title",
      type: "string",
      description: "e.g. How we started",
    }),
    defineField({
      name: "aboutStoryParagraphs",
      title: "About Page Story Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "Paragraphs detailing the founding story.",
    }),
    defineField({
      name: "aboutStoryImage",
      title: "About Page Story Image",
      type: "image",
      description: "Image displayed alongside the founding story.",
      options: { hotspot: true },
    }),
    defineField({
      name: "aboutDifferences",
      title: "About Page Difference Points",
      type: "array",
      of: [
        {
          type: "object",
          name: "differencePoint",
          title: "Difference Point",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (R) => R.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3, validation: (R) => R.required() }),
          ],
        },
      ],
      description: "Three points detailing what makes the company different.",
    }),
  ],
  preview: { select: { title: "siteName" } },
});
