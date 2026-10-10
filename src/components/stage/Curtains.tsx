import type { CurtainState } from "@/types/experience";

/**
 * Red velvet theatre curtains with a scalloped valance on top.
 * Opening and closing is a pure CSS transform transition (see globals.css),
 * driven by `data-state`.
 */
export function Curtains({ state }: { state: CurtainState }) {
  return (
    <div aria-hidden="true" className="layer-curtains" data-state={state}>
      <div className="curtain curtain-left">
        <span className="curtain-edge" />
      </div>
      <div className="curtain curtain-right">
        <span className="curtain-edge" />
      </div>
      <div className="valance">
        <span className="valance-trim" />
      </div>
    </div>
  );
}
