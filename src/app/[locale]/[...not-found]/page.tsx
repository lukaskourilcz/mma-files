import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ locale: "cs", "not-found": ["404"] }];
}

/** Route unknown locale-prefixed paths through the locale segment's Czech 404. */
export default function LocaleCatchAll() {
  notFound();
}
