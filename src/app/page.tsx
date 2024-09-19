import LandingPage from "./components/Landing";
import TrackPage from "./components/Track";

export default async function Home() {
  return (
    <div className="flex flex-col w-full h-full flex-wrap gap-2">
   <LandingPage />
      </div>
  );
}
