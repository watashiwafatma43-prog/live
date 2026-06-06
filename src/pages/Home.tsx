import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Sparkles,
  Users,
  BookOpen,
  Gamepad2,
  Trophy,
  MessageCircle,
  Brain,
  Star,
  Lightbulb,
  Target,
} from "lucide-react";
import { grades, introDialogue } from "@/data/content";
import { useProgressContext } from "@/context/ProgressContext";
import { BADGES } from "@/data/badges";
import charSara from "@assets/char_sara_nobg.png";
import charKarim from "@assets/char_karim_nobg.png";
import charNoor from "@assets/char_noor_nobg.png";
import charMona from "@assets/char_mona_nobg.png";
import charHala from "@assets/char_hala_nobg.png";
import charLeila from "@assets/char_leila_nobg.png";
import charOmar from "@assets/char_omar_nobg.png";
import charSameh from "@assets/char_sameh_nobg.png";

const characters = [
  {
    name: "سارة",
    trait: "هادية ومحبة القراءة",
    borderColor: "#f97316",
    image: charSara,
  },
  {
    name: "كريم",
    trait: "المفكر الهادئ",
    borderColor: "#22c55e",
    image: charKarim,
  },
  {
    name: "نور",
    trait: "متفائلة ومرحة",
    borderColor: "#eab308",
    image: charNoor,
  },
  {
    name: "منة",
    trait: "الفنانة المنظمة",
    borderColor: "#3b82f6",
    image: charMona,
  },
  {
    name: "هالة",
    trait: "لطيفة وذكية",
    borderColor: "#8b5cf6",
    image: charHala,
  },
  {
    name: "ليلى",
    trait: "هادئة ومبدعة",
    borderColor: "#06b6d4",
    image: charLeila,
  },
  { name: "عمر", trait: "مرح وفضولي", borderColor: "#ec4899", image: charOmar },
  {
    name: "سامح",
    trait: "شاطر ومسؤول",
    borderColor: "#64748b",
    image: charSameh,
  },
];

const gradeColors: Record<
  number,
  {
    from: string;
    to: string;
    border: string;
    text: string;
    btn: string;
    quizBtn: string;
    gameBtn: string;
    ring: string;
  }
> = {
  4: {
    from: "from-orange-400",
    to: "to-amber-400",
    border: "border-orange-200",
    text: "text-orange-600",
    btn: "bg-orange-500 hover:bg-orange-600",
    quizBtn: "bg-amber-100 hover:bg-amber-200 text-amber-800",
    gameBtn: "bg-orange-100 hover:bg-orange-200 text-orange-800",
    ring: "#f97316",
  },
  5: {
    from: "from-purple-400",
    to: "to-violet-400",
    border: "border-purple-200",
    text: "text-purple-600",
    btn: "bg-purple-500 hover:bg-purple-600",
    quizBtn: "bg-violet-100 hover:bg-violet-200 text-violet-800",
    gameBtn: "bg-purple-100 hover:bg-purple-200 text-purple-800",
    ring: "#a855f7",
  },
  6: {
    from: "from-sky-400",
    to: "to-cyan-400",
    border: "border-sky-200",
    text: "text-sky-600",
    btn: "bg-sky-500 hover:bg-sky-600",
    quizBtn: "bg-cyan-100 hover:bg-cyan-200 text-cyan-800",
    gameBtn: "bg-sky-100 hover:bg-sky-200 text-sky-800",
    ring: "#0ea5e9",
  },
};

function ProgressRing({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  const size = 80;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="absolute"
      style={{
        top: "-8px",
        left: "50%",
        transform: "translateX(-50%) rotate(-90deg)",
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay }}
      />
    </svg>
  );
}

const gradeAccent: Record<
  number,
  { bg: string; border: string; text: string; badge: string; path: string }
> = {
  4: {
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    path: "/grade/4",
  },
  5: {
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    path: "/grade/5",
  },
  6: {
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-200",
    text: "text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    path: "/grade/6",
  },
};

function DailyTip() {
  const allLessons = grades.flatMap((g) =>
    g.subjects.flatMap((s) =>
      s.scenarios.map((sc) => ({
        lesson: sc.lesson,
        title: sc.title,
        subject: s.name,
        gradeId: g.id,
        gradeName: g.name,
        scenarioPath: `/grade/${g.id}`,
      })),
    ),
  );
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const tip = allLessons[dayOfYear % allLessons.length];
  const c = gradeAccent[tip.gradeId];
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl border-2 ${c.border} bg-gradient-to-br ${c.bg} px-6 py-5 shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-xl ${c.badge} flex items-center justify-center`}
            >
              <Lightbulb size={16} />
            </div>
            <span
              className={`text-xs font-black uppercase tracking-wide ${c.text}`}
            >
              درس اليوم
            </span>
            <span className="mr-auto text-xs text-gray-400 font-semibold">
              {tip.gradeName} · {tip.subject}
            </span>
          </div>
          <p className="text-gray-800 font-bold text-base leading-relaxed mb-1">
            "{tip.lesson}"
          </p>
          <p className="text-gray-500 text-xs mb-3">من موقف: {tip.title}</p>
          <Link
            href={tip.scenarioPath}
            className={`inline-flex items-center gap-1.5 text-sm font-black ${c.text} hover:opacity-75 transition-opacity`}
          >
            شوف الموقف ده ←
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function QuickStats() {
  const { progress, earnedBadges } = useProgressContext();
  const totalScenarios = grades.flatMap((g) =>
    g.subjects.flatMap((s) => s.scenarios),
  ).length;
  const completedScenarios = Object.keys(progress.scenarios).length;
  const greenChoices = Object.values(progress.scenarios).filter(
    (v) => v === "green",
  ).length;

  if (completedScenarios === 0) return null;

  const pct = Math.round((completedScenarios / totalScenarios) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="max-w-2xl mx-auto mt-6 px-4"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-100 shadow-sm px-5 py-4">
        <p className="text-xs font-black text-gray-400 mb-3 flex items-center gap-1.5">
          <Target size={13} /> تقدمك لحد دلوقتي
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <span className="text-sm font-black text-gray-700">{pct}%</span>
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            {completedScenarios}/{totalScenarios} موقف
          </span>
          {greenChoices > 0 && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              🟢 {greenChoices} اختيار ممتاز
            </span>
          )}
          {earnedBadges.length > 0 && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              🏅 {earnedBadges.length}/{BADGES.length} شارة
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { progress } = useProgressContext();
  const completedScenarios = Object.keys(progress.scenarios);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-white pt-10 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              ✨ المنهج بطريقة مختلفة
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight mb-3">
             منهجنا{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-500 to-amber-500">
                لايف
              </span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-5">
              مش هتذاكر عشان الامتحان بس — هتكتشف إن كل درس ليه معنى حقيقي في
              حياتك اليومية
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/grade/4"
                className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-2.5 rounded-2xl text-sm transition-colors shadow-sm"
              >
                ابدأ دلوقتي ←
              </Link>
              <Link
                href="/achievements"
                className="bg-white hover:bg-amber-50 text-gray-700 font-bold px-6 py-2.5 rounded-2xl text-sm transition-colors border border-amber-200 shadow-sm"
              >
                🏆 شاراتي
              </Link>
            </div>
          </motion.div>

          <QuickStats />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-10 grid grid-cols-4 md:grid-cols-8 gap-3 px-2"
        >
          {characters.map((char, i) => (
            <motion.div key={i} className="text-center" whileHover={{ y: -4 }}>
              <div
                className="mx-auto mb-1 overflow-hidden"
                style={{ width: "100%", height: 88 }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transform: "scale(2.6)",
                    transformOrigin: "50% 54%",
                  }}
                />
              </div>
              <p className="font-black text-gray-800 text-[11px] md:text-sm">
                {char.name}
              </p>
              <p className="hidden md:block text-[10px] text-gray-500 leading-tight mt-0.5">
                {char.trait}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <Users size={20} className="text-amber-500" />
            <h2 className="font-black text-gray-800 text-xl">
              أحمد وسارة بيتكلموا
            </h2>
          </div>
          <div className="space-y-3">
            {introDialogue.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: line.side === "right" ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex ${line.side === "right" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-sm ${line.side === "right" ? "speech-bubble-right" : "speech-bubble-left"}`}
                >
                  <p className="text-xs font-bold text-gray-400 mb-1">
                    {line.speaker}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {line.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen size={20} className="text-amber-500" />
              <h2 className="font-black text-gray-800 text-2xl">اختار صفك</h2>
            </div>
            <p className="text-gray-500 text-sm">مواقف + كويز + ألعاب لكل صف</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {grades.map((grade, i) => {
              const c = gradeColors[grade.id];
              const allIds = grade.subjects.flatMap((s) =>
                s.scenarios.map((sc) => sc.id),
              );
              const totalScenarios = allIds.length;
              const doneCount = allIds.filter((id) =>
                completedScenarios.includes(id),
              ).length;
              const pct =
                totalScenarios > 0
                  ? Math.round((doneCount / totalScenarios) * 100)
                  : 0;

              return (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`grade-card bg-white rounded-3xl border-2 ${c.border} p-6 text-center shadow-sm`}
                >
                  <div
                    className="relative flex justify-center mb-4"
                    style={{ height: "72px" }}
                  >
                    <ProgressRing
                      pct={pct}
                      color={c.ring}
                      delay={0.3 + i * 0.15}
                    />
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center text-3xl shadow-md mt-0`}
                    >
                      {grade.icon}
                    </div>
                  </div>

                  <h3 className="font-black text-gray-800 text-xl mb-1">
                    {grade.name}
                  </h3>
                  <p className={`text-sm font-semibold ${c.text} mb-1`}>
                    {grade.subjects.length} مواد · {totalScenarios} موقف
                  </p>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <motion.div
                      className="h-1.5 rounded-full"
                      style={{ background: c.ring }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: 0.4 + i * 0.1,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mb-3">
                    {doneCount === 0
                      ? "لسه ما بدأتش"
                      : doneCount === totalScenarios
                        ? "✅ خلصت كل المواقف!"
                        : `${doneCount} من ${totalScenarios} مواقف`}
                  </p>

                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {grade.subjects.map((s) => (
                      <span
                        key={s.name}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/grade/${grade.id}`}
                      className={`flex items-center justify-center gap-2 ${c.btn} text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-colors`}
                    >
                      <BookOpen size={14} /> المواقف
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/quiz/${grade.id}`}
                        className={`flex items-center justify-center gap-1.5 ${c.quizBtn} text-xs font-bold px-3 py-2 rounded-xl transition-colors`}
                      >
                        <Trophy size={12} /> كويز
                      </Link>
                      <Link
                        href={`/game/${grade.id}`}
                        className={`flex items-center justify-center gap-1.5 ${c.gameBtn} text-xs font-bold px-3 py-2 rounded-xl transition-colors`}
                      >
                        <Gamepad2 size={12} /> لعبة
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <DailyTip />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="font-black text-gray-800 text-2xl">
                تعلم بطريقة تانية
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              ثلاث طرق مختلفة تساعدك تفهم أعمق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="group rounded-3xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center hover:border-orange-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
                <MessageCircle size={26} className="text-orange-500" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-2">
                مواقف من واقعك
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                بدل الحفظ، بتشوف مواقف حياتية حقيقية وبتختار ردك — وبتشوف
                النتيجة على طول
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="bg-white text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-100">
                  🟢 اختيار ممتاز
                </span>
                <span className="bg-white text-yellow-600 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-100">
                  🟡 مقبول
                </span>
                <span className="bg-white text-red-500 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                  🔴 مش أحسن
                </span>
              </div>
              <Link
                href="/grade/4"
                className="inline-block text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                ابدأ المواقف ←
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group rounded-3xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50 p-6 text-center hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Brain size={26} className="text-purple-500" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-2">
                كويز تفاعلي
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                أسئلة بتجمع بين المادة والحياة — مع شخصية بتتفاعل معاك وبتشرحلك
                كل إجابة
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="bg-white text-purple-600 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-100">
                  🥇 100% ممتاز
                </span>
                <span className="bg-white text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                  🥈 70% كويس
                </span>
                <span className="bg-white text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-100">
                  💪 حاول تاني
                </span>
              </div>
              <Link
                href="/quiz/4"
                className="inline-block text-sm font-bold text-purple-500 hover:text-purple-600 transition-colors"
              >
                ابدأ الكويز ←
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group rounded-3xl border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 text-center hover:border-sky-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sky-100 flex items-center justify-center">
                <Gamepad2 size={26} className="text-sky-500" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-2">
                لعبة المطابقة
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                طابق بين الموقف ودرسه في وقت قياسي — بتاخد نقاط وبتكسب شارات لما
                بتجيب كل الزوجين
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="bg-white text-sky-600 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-100">
                  ⚡ سريع = نقاط أكتر
                </span>
                <span className="bg-white text-cyan-600 text-xs font-bold px-2.5 py-1 rounded-full border border-cyan-100">
                  🏆 90+ ماهر
                </span>
              </div>
              <Link
                href="/game/4"
                className="inline-block text-sm font-bold text-sky-500 hover:text-sky-600 transition-colors"
              >
                العب دلوقتي ←
              </Link>
            </motion.div>
          </div>

          {/* Personality Game Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 group rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Brain size={26} className="text-indigo-500" />
            </div>
            <h3 className="font-black text-gray-800 text-lg mb-2">
              لعبة بناء الشخصية 🧠
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              اختار أفاتارك، ادخل اسمك، وعيش يوم كامل مليان مواقف — هتعرف شخصيتك
              ومناهجك المفضلة في النهاية
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="bg-white text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                🎭 12 أفاتار
              </span>
              <span className="bg-white text-purple-600 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-100">
                ⚡ 8 مواقف حياتية
              </span>
              <span className="bg-white text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-100">
                🌟 تقرير شخصيتك
              </span>
            </div>
            <Link
              href="/personality"
              className="inline-block text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              ابدأ لعبة الشخصية ←
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-3xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-black text-gray-800 text-base">
                  اكسب شارات وتابع تقدمك
                </p>
                <p className="text-gray-500 text-xs">
                  {BADGES.length} شارة مختلفة تنتظرك — من عادي لأسطوري نادر
                </p>
              </div>
            </div>
            <Link
              href="/achievements"
              className="shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm transition-colors"
            >
              <Star size={14} /> شاراتي
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
