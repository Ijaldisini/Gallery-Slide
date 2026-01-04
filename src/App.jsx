import { useEffect, useRef } from "react";
import Gallery from "./components/Gallery";
import { motion } from "framer-motion";
import FilmEndingSlide from "./components/FilmEndingSlide";

export default function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0;
    audio.play().catch(() => {});

    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 0.35) {
        vol += 0.01;
        audio.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 150);

    return () => clearInterval(fade);
  }, []);

  return (
    <div className="bg-black text-white">
      {/* MUSIC */}
      <audio ref={audioRef} loop>
        <source src="/music/romantic-piano.mp3" type="audio/mpeg" />
      </audio>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur bg-black/30">
        <span className="font-serif text-lg">US.</span>
        <span className="text-xs uppercase tracking-widest opacity-70">
          Since 2023
        </span>
      </nav>

      <Gallery />
      <div className="h-[20vh] bg-black" />
      <FilmEndingSlide  />

      
    </div>
  );
}
