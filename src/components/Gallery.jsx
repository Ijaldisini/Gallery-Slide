import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const memories = [
  {
    id: 1,
    title: "Awal Cerita Kita",
    date: "12 Januari 2023",
    desc: "Di hari itu, tanpa rencana besar, kita bertemu. Tidak ada yang istimewa, sampai aku sadar—sejak saat itu, segalanya berubah.",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Langkah Pertama",
    date: "14 Februari 2023",
    desc: "Perjalanan pertama yang kita lalui bersama. Banyak tawa, cerita kecil, dan momen sederhana yang perlahan menjadi kenangan berharga.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Momen yang Tenang",
    date: "20 Mei 2023",
    desc: "Tidak selalu tentang pergi jauh. Kadang hanya duduk berdua, berbagi diam, dan merasa cukup—itu sudah lebih dari segalanya.",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Hari Ini & Selamanya",
    date: "Hari Ini",
    desc: "Terima kasih telah bertahan, berjalan, dan tumbuh bersamaku. Aku bersyukur, karena cerita ini kita tulis bersama.",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1920&auto=format&fit=crop",
  },
];

export default function Gallery() {
  const ref = useRef(null);

  // PERBAIKAN 1: Menambahkan 'offset' agar perhitungan scroll akurat
  const { scrollYProgress } = useScroll({ 
    target: ref,
    offset: ["start start", "end end"]
  });

  // Menggeser horizontal panel
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section 
      ref={ref} 
      // PERBAIKAN 2: Memaksa position relative secara inline untuk mengatasi warning
      style={{ position: "relative" }}
      className="relative h-[350vh] md:h-[400vh] bg-[#050000]"
    >
      {/* TEXTURE NOISE */}
      <div className="pointer-events-none fixed inset-0 z-[50] opacity-[0.07] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* AMBIENT LIGHT */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#4a0000] blur-[150px] opacity-20 pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2e0000] blur-[130px] opacity-30 pointer-events-none z-0" />

      <div className="sticky top-0 h-screen flex items-center overflow-hidden z-10">
        <motion.div style={{ x }} className="flex">
          {/* === INTRO SLIDE === */}
          <div className="w-screen h-screen flex flex-col justify-center items-center text-center px-6 shrink-0 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#220505] via-[#050000] to-[#050000] z-[-1]" />

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              // UBAH FONT: Carattere (Ukuran Besar)
              className="text-7xl md:text-8xl lg:text-9xl font-['Carattere'] font-normal text-white relative leading-none"
            >
              Happy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff1a1a] to-[#500000] drop-shadow-[0_0_25px_rgba(200,0,0,0.4)]">
                Anniversary
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              // UBAH FONT: Montserrat
              className="mt-8 text-xs md:text-sm font-['Montserrat'] tracking-[0.4em] uppercase text-red-200/40 font-light"
            >
              Sebuah perjalanan waktu
            </motion.p>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-12 text-[#800000] opacity-80 text-2xl"
            >
              ↓
            </motion.div>
          </div>

          {/* === MEMORIES CARDS === */}
          {memories.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ========= TEXT REVEAL ========= */
const TextReveal = ({ text }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block py-2">
      {" "}
      {/* Padding Y agar font script tidak terpotong */}
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          className="inline-block mr-2 md:mr-4"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/* ========= CARD COMPONENT ========= */
const Card = ({ item }) => {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-6 md:px-24 shrink-0 bg-[#050000] overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover opacity-60 transition-transform duration-[3s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#2b0000]/40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050000] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050000]/90 via-transparent to-[#050000]/90" />
      </div>

      {/* CONTENT BOX */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* FOTO KIRI */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="hidden md:block relative aspect-[3/4] overflow-hidden rounded-sm border border-[#501010] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-black"
        >
          <img
            src={item.img}
            className="w-full h-full object-cover brightness-105 contrast-110"
            alt=""
          />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* TEXT KANAN */}
        <div className="text-left relative drop-shadow-lg">
          {/* TANGGAL: Font Montserrat */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-['Montserrat'] text-[#ff6666] text-xs md:text-sm uppercase tracking-[0.25em] mb-2 font-semibold"
          >
            {item.date}
          </motion.p>

          {/* JUDUL: Font Carattere (Diperbesar) */}
          <h2 className="font-['Carattere'] font-normal text-6xl md:text-8xl lg:text-9xl text-white mb-6 leading-[0.9] drop-shadow-md">
            <TextReveal text={item.title} />
          </h2>

          {/* DESKRIPSI: Font Montserrat */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-['Montserrat'] text-red-50 font-light text-sm md:text-lg leading-loose mix-blend-plus-lighter max-w-lg"
          >
            {item.desc}
          </motion.p>
        </div>
      </div>
    </div>
  );
};