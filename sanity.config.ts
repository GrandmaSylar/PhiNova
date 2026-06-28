import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { Gear, ShoppingBag, EnvelopeSimple, Eye, ChartBar } from "@phosphor-icons/react";
import { AnalyticsDashboard } from "./sanity/components/AnalyticsDashboard";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "phinova-studio",
  title: "PhiNova Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .icon(Gear)
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.documentTypeListItem("product").title("Products").icon(ShoppingBag),
            S.divider(),
            S.documentTypeListItem("contactSubmission").title("Contact Submissions").icon(EnvelopeSimple),
            S.divider(),
            S.documentTypeListItem("interactionSession").title("User Interaction Sessions").icon(Eye),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-06-01" }),
  ],
  schema: { types: schemaTypes },
  tools: (prev) => [
    ...prev,
    {
      name: "analytics",
      title: "Analytics",
      icon: ChartBar,
      component: AnalyticsDashboard,
    },
  ],
});
