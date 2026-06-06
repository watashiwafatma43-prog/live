import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Star, Trophy, RotateCcw } from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
import { grades } from "@/data/content";

import end1 from "@assets/Untitled32_1777692293179.png";
import end2 from "@assets/Untitled33_(1)_1777692293181.png";
import end3 from "@assets/Untitled34_1777692293183.png";
import end4 from "@assets/Untitled35_1777692293186.png";
import end5 from "@assets/Untitled36_(1)_1777692293189.png";
import end6 from "@assets/Untitled38_1777692293193.png";
import end7 from "@assets/Untitled39_1777692293195.png";
import end8 from "@assets/Untitled40_1777692293198.png";
import end9 from "@assets/Untitled41_1777692293200.png";
import end10 from "@assets/Untitled42_1777692994488.png";
import end11 from "@assets/Untitled43_1777692994655.png";
import end12 from "@assets/Untitled48_1777692994658.png";
import end13 from "@assets/Untitled49_1777693029904.png";
import end14 from "@assets/Untitled50_1777692315693.png";
import end15 from "@assets/Untitled51_1777692315696.png";
import end16 from "@assets/Untitled52_1777692315698.png";
import end17 from "@assets/Untitled53_1777692315701.png";
import end18 from "@assets/Untitled54_1777692315703.png";

const ALL_CHARS = [
  end1,
  end2,
  end3,
  end4,
  end5,
  end6,
  end7,
  end8,
  end9,
  end10,
  end11,
  end12,
  end13,
  end14,
  end15,
  end16,
  end17,
  end18,
];

const MESSAGES = [
  "إنت خلصت رحلة مش كثير بيخلصوها.",
  "كل موقف اتعلمته... هو لبنة في شخصيتك الحقيقية.",
  "مش بس ذاكرت — اكتشفت.",
  "المنهج مش مجرد كتب... هو حياتك.",
  "ده مش نهاية... ده البداية الحقيقية.",
];

function Particle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: x, top: y, backgroundColor: color }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        y: -120,
        x: (Math.random() - 0.5) * 200,
      }}
      transition={{ duration: 1.8, ease: "easeOut" }}
    />
  );
}

const COLORS = [
  "#f97316",
  "#a855f7",
  "#0ea5e9",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#06b6d4",
];

export default function CompletionPage() {
  const { progress, earnedBadges } = useProgressContext();
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);
  const [msgIdx, setMsgIdx] = useState(0);
  const [charSlide, setCharSlide] = useState(0);
  const particleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const allScenarioIds = grades.flatMap((g) =>
    g.subjects.flatMap((s) => s.scenarios.map((sc) => sc.id)),
  );
  const completedCount = allScenarioIds.filter(
    (id) => progress.scenarios[id],
  ).length;
  const greenCount = Object.values(progress.scenarios).filter(
    (v) => v === "green",
  ).length;
  const quizCount = Object.keys(progress.quizScores).length;
  const gameCount = Object.keys(progress.gameBestScores).length;
  const tfCount = Object.keys(progress.tfBestScores ?? {}).length;

  useEffect(() => {
    const fire = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newParticles = Array.from({ length: 12 }, () => ({
        id: particleId.current++,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
      setParticles((p) => [...p.slice(-40), ...newParticles]);
    };
    fire();
    const interval = setInterval(fire, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setCharSlide((i) => (i + 1) % ALL_CHARS.length),
      1200,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-start pt-6 pb-20 px-4"
    >
      {/* Stars background */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Crown */}
        <motion.div
          className="text-center mb-4"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <motion.div
            className="text-7xl mb-2"
            animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            👑
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-black text-white leading-tight mb-2">
            أنت أكملت
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-yellow-300 to-amber-400">
              كل الرحلة!
            </span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-purple-200 text-base font-semibold max-w-sm mx-auto"
            >
              {MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Characters parade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative h-40 mb-6 overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {ALL_CHARS.slice(0, 9).map((img, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="flex-shrink-0"
                style={{ width: 52, height: 68 }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </motion.div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-purple-900/80 to-transparent" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          {[
            {
              label: "موقف اتعلمته",
              value: completedCount,
              icon: "📖",
              color: "from-orange-400 to-amber-500",
            },
            {
              label: "اختيار ممتاز",
              value: greenCount,
              icon: "✅",
              color: "from-green-400 to-emerald-500",
            },
            {
              label: "كويز خلصته",
              value: quizCount,
              icon: "🎯",
              color: "from-purple-400 to-violet-500",
            },
            {
              label: "شارة كسبتها",
              value: earnedBadges.length,
              icon: "🏅",
              color: "from-yellow-400 to-amber-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.7 + i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-3xl p-4 text-white text-center shadow-lg`}
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs font-bold opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges earned */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 mb-5 border border-white/20"
          >
            <h3 className="text-white font-black text-base mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" />
              شاراتك اللي كسبتها
            </h3>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((b) => (
                <motion.span
                  key={b.id}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                  {b.emoji} {b.title}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 border border-yellow-400/40 rounded-3xl p-6 text-center mb-6"
        >
          <div className="text-4xl mb-3">🌟</div>
          <p className="text-yellow-200 font-black text-lg leading-relaxed">
            "كل درس تعلمته... مش بيروح.
            <br />
            هو جزء منك دلوقتي وهيفضل معاك."
          </p>
          <div className="flex gap-1 justify-center mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, delay: 1.3 + i * 0.1, repeat: 2 }}
              >
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/achievements"
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-black text-lg text-center shadow-xl"
          >
            🏆 شوف كل شاراتك
          </Link>
          <Link
            href="/"
            className="w-full py-3.5 rounded-3xl bg-white/10 border border-white/30 text-white font-bold text-base text-center"
          >
            🏠 الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
