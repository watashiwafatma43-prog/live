import { motion, AnimatePresence } from "framer-motion";
import { useProgressContext } from "@/context/ProgressContext";
import { RARITY_COLORS } from "@/data/badges";

export default function BadgeToast() {
  const { newlyEarnedBadges } = useProgressContext();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {newlyEarnedBadges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: -30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.15 }}
            className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl border-2 px-5 py-3 min-w-64"
            style={{ borderColor: badge.borderColor.replace("border-", "") }}
          >
            {/* Shine overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-l from-white/0 via-white/60 to-white/0 pointer-events-none"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 0.8, delay: i * 0.15 + 0.2 }}
            />

            {/* Badge icon */}
            <motion.div
              animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, delay: i * 0.15 + 0.1 }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${badge.bgColor} border ${badge.borderColor} shrink-0`}
            >
              {badge.emoji}
            </motion.div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${RARITY_COLORS[badge.rarity]}`}>
                  شارة جديدة!
                </span>
              </div>
              <p className={`font-black text-sm ${badge.color}`}>{badge.title}</p>
              <p className="text-xs text-gray-500 truncate">{badge.description}</p>
            </div>

            {/* Stars */}
            <div className="flex flex-col gap-0.5 shrink-0">
              {["✨", "⭐", "✨"].map((s, j) => (
                <motion.span key={j} animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, delay: i * 0.15 + 0.2 + j * 0.1, repeat: 2 }}
                  className="text-xs">{s}</motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
