import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/contact";
import { getProducts } from "@/lib/shop";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/we-buy`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...products.map((p) => ({
      url: `${SITE_URL}/shop/${p.handle}`,
      lastModified: new Date(p.listedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
