import FrameCanvas from "@/components/FrameCanvas/FrameCanvas";
import Hero from "@/sections/Hero/Hero";
import Stories from "@/sections/Stories/Stories";
import Universe from "@/sections/Universe/Universe";
import Games from "@/sections/Games/Games";
import Connect from "@/sections/Connect/Connect";

export default function HomePage() {
  return (
    <>
      <FrameCanvas />
      <Hero />
      <Stories />
      <Universe />
      <Games />
      <Connect />
    </>
  );
}
