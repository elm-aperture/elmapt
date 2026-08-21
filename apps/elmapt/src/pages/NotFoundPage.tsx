import { PageHeader } from "../components/PageHeader";

export function NotFoundPage() {
  return (
    <article className="notfound">
      <PageHeader title="Not here" subtitle="That address does not point at anything." />
      <p className="elm-container">
        <a className="elm-btn" href="/">
          Return to Home
        </a>
      </p>
    </article>
  );
}
