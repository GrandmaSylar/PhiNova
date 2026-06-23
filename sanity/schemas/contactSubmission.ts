import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "product", title: "Product Interest", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime", readOnly: true }),
    defineField({ name: "read", title: "Marked as read", type: "boolean", initialValue: false }),
    defineField({ name: "notes", title: "Internal Notes", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "name", subtitle: "email", description: "product" },
    prepare({ title, subtitle, description }) {
      return { title, subtitle: `${subtitle} — ${description}` };
    },
  },
  orderings: [
    { title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] },
    { title: "Unread first", name: "unread", by: [{ field: "read", direction: "asc" }] },
  ],
});
