import { notFound } from "next/navigation";

/** Route unknown locale-prefixed paths through the locale segment's Czech 404. */
export default function LocaleCatchAll() {
  notFound();
}
