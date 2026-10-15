import React from "react";
import { images } from "../../assets/data";
import { motion } from "framer-motion";
import Navbar from "../Nav";
import Button from "../GlobalButton";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const floatVariants = (delay = 0) => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay: delay,
    },
  },
});

const Header = () => {
  return (
    <div className="w-full p-3">
      {/* <Navbar /> */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-sm:h-[90vh] w-full mx-auto rounded-4xl relative bg-midnight overflow-hidden gap-3 px-3 flex flex-col items-center"
      >
        {/* Title Container */}
        <div className="mt-[20vh] text-white border rounded-full border-white/10 flex gap-3 justify-center items-center px-7  tracking-widest text-xs uppercase font-main py-1 "><div className="size-3 rounded-sm bg-midnight-muted"/><p>Best Event Software </p></div>
        <div className="relative   flex flex-col items-center text-center">
          {/* Blurred duplicate for soft feathered aura */}
          <motion.h1
            variants={titleVariants}
            aria-hidden="true"
            className="absolute inset-0 font-primary opacity-60 max-w-5xl bg-linear-to-r from-[#FFFFFF] to-midnight-muted bg-clip-text py-2 text-center text-[29px] leading-11 font-semibold tracking-[-1.6px] text-transparent md:text-[94px] md:leading-20 blur-[2px] select-none"
          >
            Organize. Discover. Connect
          </motion.h1>

          {/* Main sharp text on top */}
          <motion.h1
            variants={titleVariants}
            className="relative font-primary max-w-5xl bg-linear-to-r from-[#FFFFFF] to-midnight-muted bg-clip-text py-2 text-center text-[29px] leading-11 font-semibold tracking-[-1.6px] text-transparent md:text-[94px] md:leading-20"
          >
            Organize. Discover. Connect
          </motion.h1>

          {/* Floating Badges */}
          <div className="flex top-20 absolute max-w-full w-4xl justify-between items-center gap-3 mt-5 mx-auto pointer-events-none">
            <motion.img
              variants={titleVariants}
              animate="animate"
              custom={0}
              {...floatVariants(0)}
              className="w-20 drop-shadow-lg"
              src="/social.png"
              alt="Social feature"
            />
            <motion.img
              variants={titleVariants}
              animate="animate"
              custom={0.5}
              {...floatVariants(0.5)}
              className="w-20 drop-shadow-lg"
              src="/organize.png"
              alt="Organize feature"
            />
          </div>
        </div>

        {/* Subtitle / Paragraph */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          className="text-center mb-3 max-md:text-sm text-md font-main max-w-2xl  text-white z-10"
        >
          Connectify is your all-in-one platform for creating, managing, and
          discovering events — with a social twist
        </motion.p>
        <div className="mb-10 flex  gap-3">
          <Button text="Get Started" bgColor="bg-white"  textColor="text-midnight"/>
          <Button text="Lorem" bgColor="bg-transparent border border-white"  textColor="text-white"/>
        </div>

        {/* iPhone Mockup Container */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 120, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1,
              },
            },
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="max-w-[50%] max-sm:max-w-[90%] w-6xl px-3 bottom-0 overflow-hidden cursor-pointer"
        >
          <img
            src="/Iphone15.png"
            className="w-full rounded-2xl bottom-0  object-cover object-top shadow-2xl"
            alt="Connectify App Interface Preview"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Header;