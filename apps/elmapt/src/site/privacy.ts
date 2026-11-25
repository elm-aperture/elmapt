import { site } from "./site";

/* The privacy note at /privacy. Written to match what the site actually does;
 * update it when that changes (adding analytics, a new form field, a new
 * third-party embed). */

export type PrivacySection = {
  readonly heading: string;
  readonly body: readonly string[];
};

export const privacy = {
  updated: "November 2026",
  sections: [
    {
      heading: "What we collect",
      body: [
        "If you send the booking form, we receive what you type into it: your name, email, phone number, the type of shoot, preferred photographer, date, hours, city, and anything you write about the shoot. Every field except a way to reach you is optional.",
        `If you email, call, or text us, we receive whatever you send that way. We don't sell or rent your information, and we only use it to reply to you and to plan and deliver your shoot.`,
      ],
    },
    {
      heading: "How the form is sent",
      body: [
        `The booking form is delivered to ${site.contact.email} as an email through Resend, an email delivery service. If that isn't available, the form opens your own mail app instead, and nothing is sent until you press send there.`,
      ],
    },
    {
      heading: "Services this site uses",
      body: [
        "The site and its photos are hosted by Cloudflare, which processes standard request information such as your IP address to serve pages and protect the site from abuse.",
        "Headings use a typeface served by Google Fonts, and the Instagram feeds are shown through Behold. Loading those pages sends a request to those services, which can see your IP address.",
        "This site doesn't set its own cookies and doesn't run advertising trackers.",
      ],
    },
    {
      heading: "Your photos",
      body: [
        "Photos from your shoot are delivered to you privately, by MEGA link unless you ask for another method.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        `You can ask us at any time what information we have about you, or ask us to delete it, by emailing ${site.contact.email}.`,
      ],
    },
  ] satisfies readonly PrivacySection[],
} as const;
