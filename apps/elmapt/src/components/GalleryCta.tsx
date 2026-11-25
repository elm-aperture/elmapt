import { site } from "../site/site";

/** The ask at the end of a gallery: book this kind of shoot, or call. */
export function GalleryCta({ href }: { href: string }) {
  return (
    <div className="gallerycta elm-container">
      <a className="elm-btn gallerycta__book" href={href}>
        {site.booking.label}
      </a>
      <a className="gallerycta__call" href={`tel:${site.contact.tel}`}>
        or call {site.contact.phone}
      </a>
    </div>
  );
}
