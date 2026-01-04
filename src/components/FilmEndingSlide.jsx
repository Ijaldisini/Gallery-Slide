import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

/* ===============================
   1. SUMBER FOTO (HANYA 4)
   Ganti path ini sesuai file Anda
================================ */
const PhotoCollection = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
];

/* ===============================
   MOBILE DETECTION
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

  // FREEZE SCROLL
  const frozenProgress = useMotionValue(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      frozenProgress.set(Math.min(v, FREEZE_POINT));
    });
  }, [scrollYProgress]);

  // PARALLAX MOTIONS
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

  // TEXT MOTIONS
  const mainOpacity = useTransform(
    frozenProgress,
    [0, 0.3, FREEZE_POINT],
    [1, 0.85, 0.85]
  );
  const mainY = useTransform(frozenProgress, [0, FREEZE_POINT], [0, -20]);

  /* ============================================================
     LOGIKA UNTUK 4 FOTO
     Agar tidak terlihat sama persis ("grid"), kita menggeser
     urutan array untuk setiap baris.
  ============================================================= */

  // Baris 1: Urutan [1, 2, 3, 4]
  const row1 = PhotoCollection;

  // Baris 2: Urutan [2, 3, 4, 1] (Digeser 1)
  const row2 = useMemo(
    () => [...PhotoCollection.slice(1), ...PhotoCollection.slice(0, 1)],
    []
  );

  // Baris 3: Urutan [3, 4, 1, 2] (Digeser 2)
  const row3 = useMemo(
    () => [...PhotoCollection.slice(2), ...PhotoCollection.slice(0, 2)],
    []
  );

  // Baris 4: Urutan [4, 1, 2, 3] (Digeser 3)
  const row4 = useMemo(
    () => [...PhotoCollection.slice(3), ...PhotoCollection.slice(0, 3)],
    []
  );

  return (
    <section
      ref={ref}
      className="relative h-[100vh] md:h-[105vh] bg-[#050000] overflow-hidden overscroll-none"
    >
      {/* STICKY FRAME */}
      <div className="sticky top-0 h-screen overflow-hidden transform-gpu will-change-transform">
        {/* FILM WALL */}
        <div className="absolute inset-0">
          <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-4 md:px-10">
            {/* Kita passing array yang isinya cuma 4, tapi nanti diduplikasi di FilmRow */}
            <FilmRow
              photos={row1}
              direction="left"
              yMotion={yUp}
              duration={40}
            />
            <FilmRow
              photos={row2}
              direction="right"
              yMotion={yDown}
              duration={55}
            />
            <FilmRow
              photos={row3}
              direction="left"
              yMotion={yUp}
              duration={45}
            />
            <FilmRow
              photos={row4}
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
              <h2 className="text-6xl md:text-8xl font-['Carattere'] font-normal mb-6 text-white drop-shadow-lg leading-none">
                Terima kasih sudah{" "}
                <span className="text-[#ff3333] drop-shadow-[0_0_10px_rgba(255,50,50,0.5)]">
                  bersama
                </span>{" "}
                selama ini
              </h2>

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
   FILM ROW COMPONENT
================================ */
function FilmRow({ photos, direction, yMotion, duration }) {
  // LOGIKA PENTING:
  // Karena input hanya 4 foto, itu tidak cukup untuk mengisi lebar layar.
  // Kita harus menduplikasi array tersebut berkali-kali.
  // Di sini kita ulang 8 kali -> jadi total 32 item. Ini dijamin cukup panjang.
  const repeatCount = 8;
  const infinitePhotos = Array(repeatCount).fill(photos).flat();

  return (
    <motion.div style={{ y: yMotion }} className="overflow-hidden">
      <motion.div
        // Grid Auto Columns disesuaikan agar foto terlihat proporsional
        className="grid grid-flow-col auto-cols-[30vw] sm:auto-cols-[22vw] md:auto-cols-[18vw] lg:auto-cols-[14vw] gap-3 md:gap-5"
        animate={{
          // Bergerak sejauh 50% dari total panjang, lalu reset (looping)
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration,
        }}
      >
        {infinitePhotos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#501010]"
          >
            <img
              src={src}
              alt={`memory-${i}`}
              className="w-full h-full object-cover grayscale brightness-[0.5] hover:brightness-[1] transition-all duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
