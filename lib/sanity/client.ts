import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-06-01";

export const client = createClient({
  projectId: projectId ?? "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  stega: { enabled: false },
});

/** Fetch with graceful null-return when Sanity is not configured yet. */
export async function safeFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T | null> {
  if (!projectId) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}
