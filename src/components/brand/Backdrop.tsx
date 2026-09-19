import { useMemo, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import mascotVideo from "@/assets/mascots/lion_walk_parrot_fly_on_backgr.mp4";

type Particle = {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: "gold" | "red" | "electric";
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Engineering-inspired ambient background: circuit grid, glow, floating
 * particles, and a slow scanning line. Purely decorative (aria-hidden).
 */
export function Backdrop({
  className,
  particles = 18,
  dense = false,
}: {
  className?: string;
  particles?: number;
  dense?: boolean;
}) {
  const reduce = useReducedMotion();
  const dots = useMemo<Particle[]>(() => {
    const rnd = seeded(42);
    const colors: Particle["color"][] = ["gold", "gold", "gold", "electric", "red"];
    return Array.from({ length: particles }, (_, i) => ({
      x: rnd() * 100,
      y: rnd() * 100,
      size: 2 + rnd() * 4,
      delay: rnd() * 6,
      duration: 8 + rnd() * 10,
      color: colors[i % colors.length]!,
    }));
  }, [particles]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4; // Slow down the video significantly
    }
  }, []);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden opacity-60">
        <video
          ref={videoRef}
          src={mascotVideo}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
      <div className={cn("absolute inset-0 circuit-grid -z-10", dense && "opacity-80")} />
      {/* Corner glows */}
      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-electric/20 blur-[120px]" />
      <div className="absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-red/10 blur-[120px]" />

      {/* Geometric accents */}
      <div className="absolute right-[8%] top-[14%] h-24 w-24 rotate-45 rounded-lg border border-gold/25" />
      <div className="absolute left-[6%] bottom-[18%] h-16 w-16 rotate-12 rounded-md border border-red/30" />
      <div className="absolute left-[14%] top-[22%] h-2 w-2 rounded-full bg-red/70 shadow-[0_0_16px] shadow-red/60" />
      <div className="absolute right-[18%] bottom-[22%] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px] shadow-gold/70" />

      {/* Animated scan line */}
      {!reduce && (
        <div className="absolute inset-x-0 top-[38%] h-px overflow-hidden opacity-60">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold/60 to-transparent animate-line-scan" />
        </div>
      )}

      {/* Particles */}
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className={cn(
            "absolute rounded-full",
            p.color === "gold" && "bg-gold shadow-[0_0_12px] shadow-gold/60",
            p.color === "red" && "bg-red-bright shadow-[0_0_10px] shadow-red/60",
            p.color === "electric" && "bg-electric shadow-[0_0_12px] shadow-electric/60",
          )}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.5 } : { opacity: [0, 0.8, 0], y: [0, -40, -80] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
