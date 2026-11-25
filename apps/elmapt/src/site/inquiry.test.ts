import { describe, expect, it } from "vitest";
import {
  composeInquiry,
  inquiryHref,
  parseInquiry,
  replyAddress,
} from "./inquiry";
import type { Inquiry } from "./inquiry";

const blank: Inquiry = {
  name: "",
  email: "",
  phone: "",
  photographer: "",
  kind: "",
  date: "",
  hours: "",
  city: "",
  details: "",
};

describe("composeInquiry", () => {
  it("leaves empty fields out of the body", () => {
    const { body } = composeInquiry({ ...blank, email: "a@b.co", city: "Plano" });
    expect(body).toBe("Email: a@b.co\nCity: Plano");
  });

  it("puts free-text details after a blank line", () => {
    const { body } = composeInquiry({ ...blank, phone: "555", details: "Two rooms." });
    expect(body).toBe("Phone: 555\n\nTwo rooms.");
  });

  it("names the shoot and the sender in the subject", () => {
    expect(
      composeInquiry({ ...blank, name: "Dana", kind: "Headshots" }).subject,
    ).toBe("Headshots inquiry from Dana");
    expect(composeInquiry({ ...blank, email: "a@b.co" }).subject).toBe(
      "Booking inquiry from a@b.co",
    );
    expect(composeInquiry(blank).subject).toBe("Booking inquiry");
  });
});

describe("inquiryHref", () => {
  it("encodes subject and body", () => {
    const href = inquiryHref("rain@elmapt.com", {
      subject: "Hi & bye",
      body: "a\nb",
    });
    expect(href).toBe("mailto:rain@elmapt.com?subject=Hi%20%26%20bye&body=a%0Ab");
  });
});

describe("parseInquiry", () => {
  it("needs an email or a phone", () => {
    expect(parseInquiry({ name: "Dana" })).toBeNull();
    expect(parseInquiry({ phone: "555" })?.phone).toBe("555");
  });

  it("ignores junk input", () => {
    expect(parseInquiry(null)).toBeNull();
    expect(parseInquiry("text")).toBeNull();
    const parsed = parseInquiry({ email: " a@b.co ", city: 42, extra: "x" });
    expect(parsed?.email).toBe("a@b.co");
    expect(parsed?.city).toBe("");
    expect(parsed).not.toHaveProperty("extra");
  });

  it("caps long fields", () => {
    expect(parseInquiry({ email: "a@b.co", details: "x".repeat(9000) })?.details)
      .toHaveLength(4000);
  });
});

describe("replyAddress", () => {
  it("accepts a normal address and rejects header tricks", () => {
    expect(replyAddress("a@b.co")).toBe("a@b.co");
    expect(replyAddress("not an email")).toBeUndefined();
    expect(replyAddress("a@b.co, c@d.co")).toBeUndefined();
  });
});
