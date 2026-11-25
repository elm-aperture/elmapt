import { describe, expect, it } from "vitest";
import { allPaths, redirectFor, redirects, resolve } from "./routes";

describe("routes", () => {
  it("resolves the fixed pages", () => {
    expect(resolve("/").kind).toBe("home");
    expect(resolve("/booking").kind).toBe("booking");
    expect(resolve("/photographers").kind).toBe("people");
    expect(resolve("/photographers/rain").kind).toBe("person");
  });

  it("ignores a trailing slash", () => {
    expect(resolve("/realestate/hotel/").kind).toBe("work");
  });

  it("reports unknown addresses as missing", () => {
    expect(resolve("/nowhere").kind).toBe("missing");
  });

  it("has no duplicate paths", () => {
    const paths = allPaths();
    expect(new Set(paths).size).toBe(paths.length);
  });

  it.each(Object.entries(redirects))("%s redirects to a real page", (from, to) => {
    expect(redirectFor(from)).toBe(to);
    expect(resolve(to).kind).not.toBe("missing");
    // A redirect should land in one hop, never on another redirect.
    expect(redirectFor(to)).toBeUndefined();
  });

  it("never shadows a real page with a redirect", () => {
    for (const path of allPaths()) {
      expect(redirectFor(path)).toBeUndefined();
    }
  });
});
