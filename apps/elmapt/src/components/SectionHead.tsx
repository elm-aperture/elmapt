import type { ReactNode } from "react";

export function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="elm-sectionhead">
      <span className="elm-rule" aria-hidden="true" />
      <h2 className="elm-eyebrow">{children}</h2>
      <span className="elm-rule" aria-hidden="true" />
    </div>
  );
}
