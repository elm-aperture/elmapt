import { useMemo } from "react";
import { BookingForm } from "../components/BookingForm";
import { PageHeader } from "../components/PageHeader";
import { site } from "../site/site";

export function BookingPage() {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);

  return (
    <article className="booking">
      <PageHeader
        title={site.booking.label}
        subtitle="Every field is optional apart from a way to reach you."
      />
      <BookingForm
        kind={query.get("for") ?? ""}
        photographer={query.get("photographer")?.toLowerCase()}
      />
    </article>
  );
}
