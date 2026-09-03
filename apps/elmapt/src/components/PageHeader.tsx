import "../styles/work.css";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="pagehead elm-container">
      {eyebrow ? (
        <p className="pagehead__eyebrow elm-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 className="pagehead__title elm-display">{title}</h1>
      {subtitle ? <p className="pagehead__sub elm-body">{subtitle}</p> : null}
    </header>
  );
}
