import { useAmbientDrift } from "../hooks/useAmbientDrift";

export function AmbientField() {
  useAmbientDrift();
  return <div className="elm-ambient" aria-hidden="true" />;
}
