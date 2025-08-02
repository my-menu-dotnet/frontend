"use client";

import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src={Logo}
          width={80}
          height={80}
          quality={100}
          alt="company logo"
        />
      </motion.div>
    </div>
  );
}