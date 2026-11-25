export type Inquiry = {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly photographer: string;
  readonly kind: string;
  readonly date: string;
  readonly hours: string;
  readonly city: string;
  readonly details: string;
};

export type Message = {
  readonly subject: string;
  readonly body: string;
};

const LINES: readonly (readonly [label: string, key: keyof Inquiry])[] = [
  ["Name", "name"],
  ["Email", "email"],
  ["Phone", "phone"],
  ["Type of shoot", "kind"],
  ["Photographer", "photographer"],
  ["Date", "date"],
  ["Hours", "hours"],
  ["City", "city"],
];

/** Turn a booking form into an email. Empty fields are left out rather than
 * sent as blank labels. */
export function composeInquiry(inquiry: Inquiry): Message {
  const who = inquiry.name || inquiry.email || inquiry.phone;
  const what = inquiry.kind ? `${inquiry.kind} inquiry` : "Booking inquiry";

  const lines = LINES.filter(([, key]) => inquiry[key]).map(
    ([label, key]) => `${label}: ${inquiry[key]}`,
  );

  const body = inquiry.details
    ? [...lines, "", inquiry.details].join("\n")
    : lines.join("\n");

  return {
    subject: who ? `${what} from ${who}` : what,
    body,
  };
}

export function inquiryHref(to: string, message: Message): string {
  const query = [
    `subject=${encodeURIComponent(message.subject)}`,
    `body=${encodeURIComponent(message.body)}`,
  ].join("&");
  return `mailto:${to}?${query}`;
}

const FIELDS: readonly (keyof Inquiry)[] = [
  "name",
  "email",
  "phone",
  "photographer",
  "kind",
  "date",
  "hours",
  "city",
  "details",
];

const LIMIT = 4000;

/** Read an inquiry from untrusted input (a request body). Unknown keys are
 * ignored, values are trimmed and capped. Returns null unless there is a way
 * to reply: an email or a phone number. */
export function parseInquiry(raw: unknown): Inquiry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const read = (key: keyof Inquiry) => {
    const value = source[key];
    return typeof value === "string" ? value.trim().slice(0, LIMIT) : "";
  };
  const inquiry = Object.fromEntries(
    FIELDS.map((key) => [key, read(key)]),
  ) as Inquiry;
  return inquiry.email || inquiry.phone ? inquiry : null;
}

/** A plausible reply-to address, or nothing. */
export function replyAddress(email: string): string | undefined {
  return /^[^\s@<>",]+@[^\s@<>",]+\.[^\s@<>",]+$/.test(email)
    ? email
    : undefined;
}
