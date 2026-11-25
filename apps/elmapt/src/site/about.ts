import { people } from "./people";
import { site } from "./site";

/* Copy for the About section on the home page. */

export const statement: readonly string[] = [
  `${site.name} is a photo and video studio based in ${site.area}, shooting since ${site.founded}. Headshots and portraits, weddings and events, and real estate from family homes to hotels.`,
  "Our background is in live event production, so we plan around your schedule, work quickly on site, and deliver what we promised when we promised it.",
];

/** States worked in. The About numbers show the count. */
export const states: readonly string[] = [
  "TX",
  "OK",
  "KS",
  "MO",
  "AR",
  "LA",
  "FL",
];

export type Stat = { readonly figure: string; readonly label: string };

export const stats: readonly Stat[] = [
  { figure: String(site.founded), label: "Founded" },
  { figure: "50+", label: "Properties shot" },
  { figure: String(states.length), label: "States" },
  { figure: String(people.length), label: "Photographers" },
];

export type Step = { readonly title: string; readonly body: string };

export const steps: readonly Step[] = [
  {
    title: "Free consultation",
    body: "Call, text, or send the form and tell us what you need. If we can do it, we will.",
  },
  {
    title: "The shoot",
    body: "A 50% deposit holds your date. Travel anywhere in Dallas–Fort Worth is free.",
  },
  {
    title: "Delivery",
    body: "Edited photos in about 7 business days, sent by MEGA link unless you'd like them another way. Faster turnaround is available.",
  },
];

export type Question = { readonly q: string; readonly a: string };

export const faq: readonly Question[] = [
  {
    q: "How soon will I get my photos?",
    a: "Usually within 7 business days, depending on the size of the property or event. Need them sooner? Rush delivery is available for an added fee.",
  },
  {
    q: "How are photos delivered?",
    a: "By MEGA download link, unless you request another method.",
  },
  {
    q: "Can I see everything you shot?",
    a: "Yes. Ask, and we'll send every unedited JPG within about 24 hours. You can pick which ones get edited, or leave the picking and editing to us.",
  },
  {
    q: "Can I get the raw files?",
    a: "Yes, on request.",
  },
  {
    q: "Where can I use the photos?",
    a: "Anywhere you market your business or yourself: your website, listings, booking platforms, social media, and print.",
  },
  {
    q: "Do you travel?",
    a: "Travel within Dallas–Fort Worth is free. Outside DFW, travel is billed at the IRS standard mileage rate.",
  },
  {
    q: "What's the deposit and cancellation policy?",
    a: "A 50% deposit holds your date. It's non-refundable, unless we're the ones who cancel. Bad weather or similar trouble? Reschedule free to whenever suits you.",
  },
  {
    q: "Do you shoot video?",
    a: "Yes. Video can be added to any shoot. Mention it in your consultation.",
  },
];
