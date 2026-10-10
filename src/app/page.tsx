import { Experience } from "@/components/Experience";
import { SoundProvider } from "@/components/providers/SoundProvider";

export default function Home() {
  return (
    <SoundProvider>
      <Experience />
    </SoundProvider>
  );
}
