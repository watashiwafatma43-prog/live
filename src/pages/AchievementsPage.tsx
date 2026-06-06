import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, Star, Trophy } from "lucide-react";
import { BADGES, RARITY_COLORS, RARITY_LABELS } from "@/data/badges";
import { grades } from "@/data/content";
import { useProgressContext } from "@/context/ProgressContext";

function StatRing({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          <motion.circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-gray-800">
            {value}/{max}
          </span>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-500 text-center">
        {label}
      </span>
    </div>
  );
}

export default function AchievementsPage() {
  const { progress, earnedBadges, resetProgress } = useProgressContext();

  const totalScenarios = grades.flatMap((g) =>
    g.subjects.flatMap((s) => s.scenarios),
  ).length;
  const completedScenarios = Object.keys(progress.scenarios).length;
  const greenScenarios = Object.values(progress.scenarios).filter(
    (v) => v === "green",
  ).length;
  const quizzesDone = Object.keys(progress.quizScores).length;
  const gamesDone = Object.keys(progress.gameBestScores).length;
  const bestQuiz = Math.max(0, ...Object.values(progress.quizScores));
  const bestGame = Math.max(0, ...Object.values(progress.gameBestScores));

  const unearnedBadges = BADGES.filter(
    (b) => !progress.earnedBadges.includes(b.id),
  );

  const handleReset = () => {
    if (confirm("هتمسح كل تقدمك وشاراتك. متأكد؟")) resetProgress();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold mb-3 text-amber-600"
        >
          <ArrowRight size={14} /> الرئيسية
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <h1 className="font-black text-gray-800 text-2xl">
                شاراتك وإنجازاتك
              </h1>
              <p className="text-gray-500 text-sm">
                {earnedBadges.length} من {BADGES.length} شارة
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors font-bold px-3 py-1.5 rounded-xl hover:bg-red-50"
          >
            <RotateCcw size={12} /> إعادة تعيين
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-8">
        {/* Stats overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-amber-100 p-6"
        >
          <h2 className="font-black text-gray-700 text-lg mb-5 flex items-center gap-2">
            <Star size={18} className="text-amber-400" /> إحصائياتك
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 justify-items-center">
            <StatRing
              value={completedScenarios}
              max={totalScenarios}
              color="#f97316"
              label="مواقف مكتملة"
            />
            <StatRing
              value={greenScenarios}
              max={totalScenarios}
              color="#22c55e"
              label="اختيارات صح"
            />
            <StatRing
              value={quizzesDone}
              max={3}
              color="#a855f7"
              label="كويزات"
            />
            <StatRing value={gamesDone} max={3} color="#0ea5e9" label="ألعاب" />
            <StatRing
              value={earnedBadges.length}
              max={BADGES.length}
              color="#f59e0b"
              label="شارات"
            />
          </div>

          {/* Best scores */}
          {(bestQuiz > 0 || bestGame > 0) && (
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              {bestQuiz > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-2 text-sm font-bold text-purple-700">
                  🎯 أحسن كويز: {bestQuiz}%
                </div>
              )}
              {bestGame > 0 && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl px-4 py-2 text-sm font-bold text-sky-700">
                  🃏 أحسن لعبة: {bestGame}/100
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Grade progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-amber-100 p-6"
        >
          <h2 className="font-black text-gray-700 text-lg mb-4">
            تقدمك في كل صف
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {grades.map((grade) => {
              const allIds = grade.subjects.flatMap((s) =>
                s.scenarios.map((sc) => sc.id),
              );
              const done = allIds.filter((id) => progress.scenarios[id]).length;
              const pct = Math.round((done / allIds.length) * 100);
              const gradeColors: Record<
                number,
                { bar: string; bg: string; text: string; border: string }
              > = {
                4: {
                  bar: "bg-orange-400",
                  bg: "bg-orange-50",
                  text: "text-orange-700",
                  border: "border-orange-200",
                },
                5: {
                  bar: "bg-purple-400",
                  bg: "bg-purple-50",
                  text: "text-purple-700",
                  border: "border-purple-200",
                },
                6: {
                  bar: "bg-sky-400",
                  bg: "bg-sky-50",
                  text: "text-sky-700",
                  border: "border-sky-200",
                },
              };
              const c = gradeColors[grade.id];
              return (
                <div
                  key={grade.id}
                  className={`${c.bg} ${c.border} border rounded-2xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{grade.icon}</span>
                    <span className={`font-black text-sm ${c.text}`}>
                      {grade.name}
                    </span>
                    {done === allIds.length && (
                      <span className="text-green-500 text-sm">✓</span>
                    )}
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full ${c.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-semibold">
                    {done}/{allIds.length} موقف · {pct}%
                  </p>
                  {/* Per-subject breakdown */}
                  <div className="mt-3 space-y-1">
                    {grade.subjects.map((subj) => {
                      const subjDone = subj.scenarios.filter(
                        (sc) => progress.scenarios[sc.id],
                      ).length;
                      return (
                        <div
                          key={subj.name}
                          className="flex items-center justify-between text-xs text-gray-500"
                        >
                          <span>{subj.name}</span>
                          <span className="font-bold">
                            {subjDone}/{subj.scenarios.length}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-black text-gray-700 text-lg mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" /> شاراتك المكسوبة (
              {earnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.25 + i * 0.06,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className={`${badge.bgColor} border-2 ${badge.borderColor} rounded-3xl p-4 text-center relative overflow-hidden`}
                >
                  <motion.div
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                    className="text-4xl mb-2"
                  >
                    {badge.emoji}
                  </motion.div>
                  <p className={`font-black text-sm ${badge.color} mb-1`}>
                    {badge.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {badge.description}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${RARITY_COLORS[badge.rarity]}`}
                  >
                    {RARITY_LABELS[badge.rarity]}
                  </span>
                  {badge.rarity === "legendary" && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-3xl"
                      animate={{
                        boxShadow: [
                          "0 0 0px #fbbf24",
                          "0 0 20px #fbbf2466",
                          "0 0 0px #fbbf24",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked badges */}
        {unearnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-black text-gray-500 text-lg mb-4">
              🔒 شارات لسه قدامك ({unearnedBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unearnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-4 text-center opacity-60"
                >
                  <div className="text-4xl mb-2 grayscale">{badge.emoji}</div>
                  <p className="font-black text-sm text-gray-500 mb-1">
                    {badge.title}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight">
                    {badge.description}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${RARITY_COLORS[badge.rarity]}`}
                  >
                    {RARITY_LABELS[badge.rarity]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA if nothing done */}
        {completedScenarios === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="font-black text-gray-700 text-xl mb-2">
              ابدأ تجمع شاراتك!
            </h3>
            <p className="text-gray-500 mb-6">
              روح لأي صف واعمل مواقف وكويزات وألعاب
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {grades.map((g) => (
                <Link
                  key={g.id}
                  href={`/grade/${g.id}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-2xl text-sm transition-colors"
                >
                  {g.icon} {g.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
