import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Home,
  Trophy,
  Gamepad2,
  Medal,
  NotebookPen,
} from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";
import { useStreak } from "@/hooks/useStreak";

const gradeLinks = [
  {
    id: 4,
    label: "الرابع",
    active: "bg-orange-100 text-orange-600",
    base: "/grade/4",
  },
  {
    id: 5,
    label: "الخامس",
    active: "bg-purple-100 text-purple-600",
    base: "/grade/5",
  },
  {
    id: 6,
    label: "السادس",
    active: "bg-sky-100 text-sky-600",
    base: "/grade/6",
  },
];

export default function Navbar() {
  const [location] = useLocation();
  const { earnedBadges } = useProgressContext();
  const { streak, isNew } = useStreak();
  const gradeId = location.match(/\/(grade|quiz|game)\/(\d)/)?.[2];

  const streakColor =
    streak >= 7
      ? "bg-red-100 text-red-600"
      : streak >= 3
        ? "bg-orange-100 text-orange-600"
        : "bg-amber-50 text-amber-600";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-black text-gray-800 text-base group-hover:text-orange-500 transition-colors hidden sm:block">
            منهجنا لايف
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 overflow-x-auto flex-1 justify-center">
          <Link
            href="/"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${location === "/" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Home size={14} /> الرئيسية
          </Link>

          {gradeLinks.map((g) => {
            const isThisGrade = gradeId === String(g.id);
            const onGrade = location === g.base;
            const onQuiz = location === `/quiz/${g.id}`;
            const onGame = location === `/game/${g.id}`;
            return (
              <div key={g.id} className="flex items-center gap-0.5">
                <Link
                  href={g.base}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${onGrade ? g.active : "text-gray-500 hover:bg-gray-100"}`}
                >
                  {g.label}
                </Link>
                {isThisGrade && (
                  <>
                    <Link
                      href={`/quiz/${g.id}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${onQuiz ? g.active : "text-gray-400 hover:bg-gray-100"}`}
                      title="كويز"
                    >
                      <Trophy size={13} />
                    </Link>
                    <Link
                      href={`/game/${g.id}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${onGame ? g.active : "text-gray-400 hover:bg-gray-100"}`}
                      title="لعبة"
                    >
                      <Gamepad2 size={13} />
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence>
            {streak > 0 && (
              <motion.div
                key={streak}
                initial={
                  isNew ? { scale: 0.6, opacity: 0 } : { scale: 1, opacity: 1 }
                }
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  isNew
                    ? { type: "spring", stiffness: 400, damping: 18 }
                    : { duration: 0 }
                }
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black ${streakColor} select-none`}
                title={`${streak} يوم متتالي`}
              >
                <motion.span
                  animate={
                    isNew
                      ? { rotate: [-15, 15, -10, 10, 0], scale: [1, 1.3, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm leading-none"
                >
                  🔥
                </motion.span>
                <span>{streak}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/lessons"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
              location === "/lessons"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
            }`}
            title="دفتر الدروس"
          >
            <NotebookPen size={15} />
            <span>دفتري</span>
          </Link>

          <Link
            href="/achievements"
            className={`hidden sm:flex relative items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
              location === "/achievements"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            <Medal size={15} />
            <span>شاراتي</span>
            {earnedBadges.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-white text-xs font-black flex items-center justify-center leading-none">
                {earnedBadges.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
