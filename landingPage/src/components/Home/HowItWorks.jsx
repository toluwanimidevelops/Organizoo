import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Urban Architecture",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Minimal Design",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Abstract Art",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Nature & Light",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Dynamic Shapes",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
    title: "Vibrant Colorway",
  },
];

const HowItWorks = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance interval (3.5 seconds) that pauses on direct interaction
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSelect = (index) => {
    setActiveIdx(index);
    setIsPaused(true); // Locks auto-play once the user selects a card manually
  };

  return (
    <div className="w-full px-3 py-20 mt-5 max-w-7xl mx-auto">
      <h1 className="text-[48px] text-center font-normal tracking-tighter font-main">
        How it works
      </h1>
      <p className="text-sm text-center mx-auto text-slate-500 font-main mt-2 max-w-lg">
        A visual collection of our most recent works — each piece crafted with
        intention, emotion, and style.
      </p>

      <div className="flex items-center  gap-0 h-[420px] w-full mt-10 mx-auto">
        {images.map((img, index) => {
          const isActive = activeIdx === index;

          return (
            <motion.div
              key={img.id}
              layout
              onClick={() => handleSelect(index)}
              animate={{
                flex: isActive ? 6 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 28,
              }}
              className={`relative p-3 ${isActive ? "bg-gray-200/30 backdrop-blur-xl border border-gray-500/20" : "bg-transparent"} cursor-pointer rounded-xl overflow-hidden h-full select-none`}
            >
              <motion.img
                layout="position"
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover object-center rounded-xl pointer-events-none"
              />

              {/* Dynamic Overlay */}

              {/* Title overlay revealed only on active expanded card */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, delay: 0.15 }}
                    className="absolute bottom-5 left-5 right-5 text-white font-main"
                  >
                    <span className="text-xs uppercase tracking-widest text-slate-300 font-mono">
                      0{index + 1}
                    </span>
                    <h3 className="text-xl font-medium mt-0.5">{img.title}</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
