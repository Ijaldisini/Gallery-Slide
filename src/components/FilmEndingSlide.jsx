import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

/* ===============================
   MOBILE DETECTION (Tidak diubah)
================================ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

const FREEZE_POINT = 0.85;

/* ===============================
   MAIN COMPONENT
================================ */
export default function FilmEndingSlide() {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll();

  /* ===============================
     FREEZE SCROLL (Tidak diubah)
  ================================ */
  const frozenProgress = useMotionValue(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      frozenProgress.set(Math.min(v, FREEZE_POINT));
    });
  }, [scrollYProgress]);

  /* ===============================
     PARALLAX MOTIONS (Tidak diubah)
  ================================ */
  const yUp = useTransform(
    frozenProgress,
    [0, FREEZE_POINT],
    isMobile ? ["0%", "-12%"] : ["0%", "0%"]
  );

  const yDown = useTransform(
    frozenProgress,
    [0, FREEZE_POINT],
    isMobile ? ["0%", "12%"] : ["0%", "0%"]
  );

  /* ===============================
     TEXT MOTIONS (Tidak diubah)
  ================================ */
  const mainOpacity = useTransform(
    frozenProgress,
    [0, 0.3, FREEZE_POINT],
    [1, 0.85, 0.85]
  );

  const mainY = useTransform(frozenProgress, [0, FREEZE_POINT], [0, -20]);

  const photos = Array(14).fill(
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2"
  );

  return (
    <section
      ref={ref}
      className="
        relative 
        h-[100vh] md:h-[105vh]
        bg-[#050000] 
        overflow-hidden 
        overscroll-none
      "
    >
      {/* STICKY FRAME */}
      <div className="sticky top-0 h-screen overflow-hidden transform-gpu will-change-transform">
        {/* FILM WALL */}
        <div className="absolute inset-0">
          <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-4 md:px-10">
            <FilmRow
              photos={photos}
              direction="left"
              yMotion={yUp}
              duration={40}
            />
            <FilmRow
              photos={photos}
              direction="right"
              yMotion={yDown}
              duration={55}
            />
            <FilmRow
              photos={photos}
              direction="left"
              yMotion={yUp}
              duration={45}
            />
            <FilmRow
              photos={photos}
              direction="right"
              yMotion={yDown}
              duration={60}
            />
          </div>

          {/* OVERLAY */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#050000]/80 via-[#2b0000]/30 to-[#050000]/90" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050000)]" />

          {/* TEXT CONTENT */}
          <motion.div
            style={{ opacity: mainOpacity, y: mainY }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="max-w-xl text-center px-6">
              {/* JUDUL: Menggunakan Carattere (Ukuran diperbesar) */}
              <h2 className="text-6xl md:text-8xl font-['Carattere'] font-normal mb-6 text-white drop-shadow-lg leading-none">
                Terima kasih sudah{" "}
                <span className="text-[#ff3333] drop-shadow-[0_0_10px_rgba(255,50,50,0.5)]">
                  bersama
                </span>{" "}
                selama ini
              </h2>

              {/* DESKRIPSI: Menggunakan Montserrat */}
              <p className="font-['Montserrat'] text-red-50/90 text-sm md:text-lg leading-relaxed font-light tracking-wide">
                Untuk setiap tawa, diam, dan cerita kecil yang kita simpan.
                <br />
                Terima kasih sudah memilih untuk bertahan,
                <br />
                dan berjalan sejauh ini bersamaku.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===============================
   FILM ROW
================================ */
function FilmRow({ photos, direction, yMotion, duration }) {
  return (
    <motion.div style={{ y: yMotion }} className="overflow-hidden">
      <motion.div
        className="grid grid-flow-col auto-cols-[30vw] sm:auto-cols-[22vw] md:auto-cols-[18vw] lg:auto-cols-[14vw] gap-3 md:gap-5"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration,
        }}
      >
        {photos.concat(photos).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="aspect-[3/4] w-full object-cover grayscale brightness-[0.5] hover:brightness-[0.8] transition-all duration-500 rounded-sm border border-[#501010]"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
