export function pageMeta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | TENURE AI` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | TENURE AI` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}