import type { LightMode } from "@/types/experience";

/** The deepest layer: dark theatre walls with warm burgundy ambience. */
export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="layer-background">
      <div className="bg-ambient" />
    </div>
  );
}

/**
 * Light that falls *onto* the stage (and the curtains): the spotlight beam,
 * the pool of light on the floor and a scrim that darkens the room.
 */
export function StageLighting({ light }: { light: LightMode }) {
  return (
    <div aria-hidden="true" className="layer-lighting" data-light={light}>
      <div className="light-scrim" />
      <div className="light-beam" />
      <div className="light-pool" />
      <div className="light-vignette" />
    </div>
  );
}

/** Very subtle, slowly shifting film grain over everything. */
export function FilmGrain() {
  return <div aria-hidden="true" className="film-grain" />;
}
