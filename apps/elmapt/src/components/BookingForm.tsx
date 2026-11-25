import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { categories } from "../gallery/manifest";
import { people } from "../site/people";
import { site } from "../site/site";
import { composeInquiry, inquiryHref } from "../site/inquiry";
import type { Inquiry } from "../site/inquiry";
import "../styles/booking.css";

const NO_PREFERENCE = "No preference";

type Status = "idle" | "sending" | "sent" | "mailto";

const STATUS: Record<Status, string> = {
  idle: "",
  sending: "Sending…",
  sent: "Sent. We'll reply soon.",
  mailto:
    "Your mail app should now be open with this inquiry filled in. Press send there to finish.",
};

async function send(payload: Inquiry & { website: string }): Promise<boolean> {
  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** The booking form plus direct contact details. Used on /booking and at the
 * foot of each landing page. `photographer` is a slug, `kind` a work title. */
export function BookingForm({
  kind = "",
  photographer,
}: {
  kind?: string;
  photographer?: string;
}) {
  const initial = useMemo(() => {
    const person = people.find((entry) => entry.slug === photographer);
    return { kind, photographer: person?.name ?? NO_PREFERENCE };
  }, [kind, photographer]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const inquiry: Inquiry = {
      name: field("name"),
      email: field("email"),
      phone: field("phone"),
      photographer: field("photographer"),
      kind: field("kind"),
      date: field("date"),
      hours: field("hours"),
      city: field("city"),
      details: field("details"),
    };

    if (!inquiry.email && !inquiry.phone) {
      setError("Include an email or a phone number so we can reply.");
      return;
    }

    setError("");
    setStatus("sending");

    const delivered = await send({ ...inquiry, website: field("website") });
    if (delivered) {
      form.reset();
      setStatus("sent");
      return;
    }

    // The server couldn't send it: hand it to the visitor's mail app.
    window.location.href = inquiryHref(
      site.contact.email,
      composeInquiry(inquiry),
    );
    setStatus("mailto");
  };

  return (
      <div className="booking__body elm-container">
        <form className="booking__form elm-surface" onSubmit={onSubmit} noValidate>
          <div className="booking__row">
            <label className="booking__field">
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" />
            </label>
          </div>

          <div className="booking__row booking__row--pair">
            <label className="booking__field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label className="booking__field">
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
          </div>

          {error ? (
            <p className="booking__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="booking__row booking__row--pair">
            <label className="booking__field">
              <span>Type of shoot</span>
              <select name="kind" defaultValue={initial.kind}>
                <option value="">Not sure yet</option>
                {categories.map((category) => (
                  <optgroup key={category.slug} label={category.label}>
                    {category.work.map((work) => (
                      <option key={work.slug} value={work.title}>
                        {work.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="booking__field">
              <span>Photographer</span>
              <select name="photographer" defaultValue={initial.photographer}>
                <option value={NO_PREFERENCE}>{NO_PREFERENCE}</option>
                {people.map((person) => (
                  <option key={person.slug} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="booking__row booking__row--pair">
            <label className="booking__field">
              <span>Date</span>
              <input name="date" type="date" />
            </label>
            <label className="booking__field">
              <span>Hours</span>
              <input name="hours" type="text" placeholder="e.g. 2pm to 6pm" />
            </label>
          </div>

          <div className="booking__row">
            <label className="booking__field">
              <span>City</span>
              <input name="city" type="text" autoComplete="address-level2" />
            </label>
          </div>

          <div className="booking__row">
            <label className="booking__field">
              <span>About the shoot</span>
              <textarea name="details" rows={5} />
            </label>
          </div>

          {/* Honeypot: hidden from people, filled in by bots. */}
          <label className="booking__trap" aria-hidden="true">
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          <button
            type="submit"
            className="elm-btn booking__submit"
            disabled={status === "sending"}
          >
            Send inquiry
          </button>

          <p className="booking__status" aria-live="polite">
            {STATUS[status]}
          </p>
        </form>

        <aside className="booking__direct">
          <p className="elm-eyebrow">Or reach us directly</p>
          <ul>
            <li>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </li>
            <li>
              <a href={`tel:${site.contact.tel}`}>{site.contact.phone}</a>
            </li>
            <li>
              <a href={site.instagram.href} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </aside>
      </div>
  );
}
