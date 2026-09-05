// components/seo/JsonLd.tsx
// Renders one JSON-LD <script> tag. JSON.stringify already escapes quotes
// correctly for this context; the one remaining risk is a literal
// "</script>" inside a string value (e.g. a place description) breaking
// out of the tag early, so that sequence is neutralized below.

export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
