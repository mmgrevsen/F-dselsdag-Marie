/**
 * Entry point for the shareable single-file version of the experience
 * (see scripts/build-artifact.mjs). The Next.js app and this build render the
 * exact same components – only the way they are mounted differs.
 */
import { createRoot } from "react-dom/client";
import { Experience } from "@/components/Experience";
import { SoundProvider } from "@/components/providers/SoundProvider";

const container = document.getElementById("oplevelse");

if (container) {
  createRoot(container).render(
    <SoundProvider>
      <Experience />
    </SoundProvider>,
  );
}
