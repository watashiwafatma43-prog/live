import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, NotebookPen, Medal, Brain } from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";

const grades = [
  { id: 4, label: "الرابع", color: "bg-orange-100 text-orange-600 hover:bg-orange-200" },
  { id: 5, label: "الخامس", color: "bg-purple-100 text-purple-600 hover:bg-purple-200" },
  { id: 6, label: "السادس", color: "bg-sky-100 text-sky-600 hover:bg-sky-200" },
];

export default function BottomNav() {
  const [location] = useLocation();
  const [showGrades, setShowGrades] = useState(false);
  const { earnedBadges } = useProgressContext();

  const gradeMatch = location.match(/\/(grade|quiz|game)\/(\d)/);
  const isGradeSection = !!gradeMatch;

  const navItems = [
    { href: "/", icon: Home, label: "الرئيسية", active: location === "/" },
    { href: "/personality", icon: Brain, label: "شخصيتي", active: location === "/personality" },
    { href: "/achievements", icon: Medal, label: "شاراتي", active: location === "/achievements", badge: earnedBadges.length },
  ];

  return (
    <>
      <AnimatePresence>
        {showGrades && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setShowGrades(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-20 right-0 left-0 z-50 flex justify-center sm:hidden px-6"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-3 flex gap-2 w-full max-w-xs">
                {grades.map((g) => (
                  <Link
                    key={g.id}
                    href={`/grade/${g.id}`}
                    onClick={() => setShowGrades(false)}
                    className={`flex-1 text-center py-3 rounded-2xl font-black text-sm transition-colors ${g.color}`}
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/96 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-2">
          {/* Home */}
          <Link href="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              location === "/" ? "text-orange-500 bg-orange-50" : "text-gray-400 hover:text-gray-600"
            }`}>
            <Home size={22} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </Link>

          {/* Grades popup */}
          <button
            onClick={() => setShowGrades((v) => !v)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              isGradeSection || showGrades ? "text-orange-500 bg-orange-50" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <motion.div animate={showGrades ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.2 }}>
              <BookOpen size={22} />
            </motion.div>
            <span className="text-[10px] font-bold">صفوفي</span>
          </button>

          {/* Personality */}
          <Link href="/personality"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              location === "/personality" ? "text-indigo-500 bg-indigo-50" : "text-gray-400 hover:text-gray-600"
            }`}>
            <Brain size={22} />
            <span className="text-[10px] font-bold">شخصيتي</span>
          </Link>

          {/* Achievements */}
          <Link href="/achievements"
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              location === "/achievements" ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:text-gray-600"
            }`}>
            <Medal size={22} />
            <span className="text-[10px] font-bold">شاراتي</span>
            {earnedBadges.length > 0 && (
              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-yellow-400 text-white text-[9px] font-black flex items-center justify-center leading-none">
                {earnedBadges.length > 9 ? "9+" : earnedBadges.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
