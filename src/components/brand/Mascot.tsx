import { motion, useReducedMotion } from "motion/react";
import lion from "@/assets/mascots/lion.png";
import parrot from "@/assets/mascots/kili_thinking.png";
import { cn } from "@/lib/utils";

type MascotProps = {
  kind: "lion" | "parrot";
  className?: string;
  /** Floating amplitude in px */
  amplitude?: number;
  /** Seconds for one float cycle */
  duration?: number;
  delay?: number;
  flip?: boolean;
};

const SRC = { lion, parrot } as const;
const ALT = {
  lion: "Swastiks lion — leadership, strength and engineering excellence",
  parrot: "Swastiks parrot — communication, ideas and employee voice",
} as const;

/**
 * Subtle floating mascot. Swap the PNGs in src/assets/mascots to use the
 * official company artwork — no code changes needed.
 */
export function Mascot({
  kind,
  className,
  amplitude = 15,
  duration = 5,
  delay = 0,
  flip,
}: MascotProps) {
  return (
    <motion.img
      src={SRC[kind]}
      alt={ALT[kind]}
      width={1024}
      height={1024}
      loading="lazy"
      draggable={false}
      className={cn(
        "pointer-events-none select-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]",
        flip && "-scale-x-100",
        className,
      )}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: [0, -amplitude, 0],
        rotate: [0, flip ? -2 : 2, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.6, delay, ease: "easeOut" },
        scale: { duration: 0.6, delay, ease: "easeOut" },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.2 },
        rotate: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.2 },
      }}
    />
  );
}
