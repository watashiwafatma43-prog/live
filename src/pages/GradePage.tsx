import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { grades } from "@/data/content";
import type { Scenario } from "@/data/content";
import { useProgressContext } from "@/context/ProgressContext";
import charSara from "@assets/char_sara_nobg.png";
import charKarim from "@assets/char_karim_nobg.png";
import charNoor from "@assets/char_noor_nobg.png";
import charMona from "@assets/char_mona_nobg.png";
import charHala from "@assets/char_hala_nobg.png";
import charLeila from "@assets/char_leila_nobg.png";
import charOmar from "@assets/char_omar_nobg.png";
import charSameh from "@assets/char_sameh_nobg.png";
import charZiad from "@assets/char_ziad_nobg.png";
import charSeif from "@assets/char_seif_nobg.png";
import charMazen from "@assets/char_mazen_nobg.png";
import charMahmoud from "@assets/char_mahmoud_nobg.png";

const CHAR_IMAGES: Record<string, string> = {
  عمر: charOmar,
  سامح: charSameh,
  نور: charNoor,
  هالة: charHala,
  كريم: charKarim,
  زياد: charZiad,
  محمود: charMahmoud,
  سارة: charSara,
  مازن: charMazen,
  سيف: charSeif,
  نادية: charLeila,
  منة: charMona,
};

interface GradePageProps {
  gradeId: number;
}

const gradeConfig: Record<
  number,
  {
    bg: string;
    accent: string;
    accentHex: string;
    accentLight: string;
    accentText: string;
    tabActive: string;
    chars: { name: string; borderColor: string; image: string }[];
  }
> = {
  4: {
    bg: "from-orange-50 via-amber-50 to-white",
    accent: "bg-orange-500",
    accentHex: "#f97316",
    accentLight: "bg-orange-100",
    accentText: "text-orange-600",
    tabActive: "bg-orange-500 text-white shadow-md shadow-orange-200",
    chars: [
      { name: "عمر", borderColor: "#f97316", image: charOmar },
      { name: "سامح", borderColor: "#22c55e", image: charSameh },
      { name: "نور", borderColor: "#eab308", image: charNoor },
      { name: "هالة", borderColor: "#a855f7", image: charHala },
    ],
  },
  5: {
    bg: "from-purple-50 via-violet-50 to-white",
    accent: "bg-purple-500",
    accentHex: "#a855f7",
    accentLight: "bg-purple-100",
    accentText: "text-purple-600",
    tabActive: "bg-purple-500 text-white shadow-md shadow-purple-200",
    chars: [
      { name: "كريم", borderColor: "#f97316", image: charKarim },
      { name: "زياد", borderColor: "#3b82f6", image: charZiad },
      { name: "محمود", borderColor: "#22c55e", image: charMahmoud },
      { name: "سارة", borderColor: "#a855f7", image: charSara },
    ],
  },
  6: {
    bg: "from-sky-50 via-cyan-50 to-white",
    accent: "bg-sky-500",
    accentHex: "#0ea5e9",
    accentLight: "bg-sky-100",
    accentText: "text-sky-600",
    tabActive: "bg-sky-500 text-white shadow-md shadow-sky-200",
    chars: [
      { name: "مازن", borderColor: "#f97316", image: charMazen },
      { name: "سيف", borderColor: "#3b82f6", image: charSeif },
      { name: "نادية", borderColor: "#22c55e", image: charLeila },
      { name: "فرح", borderColor: "#eab308", image: charMona },
    ],
  },
};

const choiceColors = {
  red: {
    btn: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 active:scale-95",
    dot: "🔴",
    emotions: ["😢", "😬", "😟", "😔"],
  },
  yellow: {
    btn: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 active:scale-95",
    dot: "🟡",
    emotions: ["🤔", "😊", "😌", "🙂"],
  },
  green: {
    btn: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 active:scale-95",
    dot: "🟢",
    emotions: ["🎉", "😄", "🥳", "👏"],
  },
};

const IDLE_EMOTIONS = ["🤔", "😊", "😮", "💡"];

function CharacterSprite({
  image,
  name,
  isActive,
  isSpeaking,
  emotion,
  delay = 0,
  accentHex,
}: {
  image: string;
  name: string;
  isActive: boolean;
  isSpeaking: boolean;
  emotion: string;
  delay?: number;
  accentHex: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center select-none"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      {/* Emotion bubble above character */}
      <motion.div
        key={emotion}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm border border-gray-100 mb-1"
      >
        {emotion}
      </motion.div>

      {/* Character — natural image with zoom+crop trick */}
      <motion.div
        animate={
          isSpeaking
            ? { y: [0, -10, 0, -5, 0], scale: [1, 1.05, 1] }
            : isActive
              ? { y: [0, -5, 0] }
              : { y: 0, scale: 0.92 }
        }
        transition={
          isSpeaking
            ? { duration: 0.45, ease: "easeOut" }
            : isActive
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }
              : { duration: 0.3 }
        }
        style={{
          filter: isActive
            ? "none"
            : "grayscale(45%) brightness(0.68) opacity(0.75)",
          transition: "filter 0.35s ease",
        }}
      >
        <div style={{ width: 80, height: 108, overflow: "hidden" }}>
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "scale(2.6)",
              transformOrigin: "50% 54%",
            }}
          />
        </div>
      </motion.div>

      {/* Name */}
      <motion.p
        className="text-[11px] font-black mt-1"
        animate={{ color: isActive ? accentHex : "#9ca3af" }}
        transition={{ duration: 0.3 }}
      >
        {name}
      </motion.p>
    </motion.div>
  );
}

function DialogueBubble({
  text,
  label,
  emoji,
  tail = "left",
  accentHex,
}: {
  text: string;
  label?: string;
  emoji?: string;
  tail?: "left" | "right" | "center" | "none";
  accentHex: string;
}) {
  const tailPos =
    tail === "left"
      ? "left-8"
      : tail === "right"
        ? "right-8"
        : "left-1/2 -translate-x-1/2";
  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 px-5 py-4">
        {label && (
          <p
            className="text-[11px] font-black mb-1.5 flex items-center gap-1.5"
            style={{ color: accentHex }}
          >
            {emoji && <span>{emoji}</span>}
            {label}
          </p>
        )}
        <p className="text-sm sm:text-base text-gray-800 font-semibold leading-relaxed">
          {text}
        </p>
      </div>
      {tail !== "none" && (
        <div className={`absolute bottom-0 ${tailPos} translate-y-full`}>
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
        </div>
      )}
    </div>
  );
}

function LessonCard({
  lesson,
  subject,
  accentHex,
}: {
  lesson: string;
  subject: string;
  accentHex: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 mt-2"
    >
      <p className="text-[11px] font-black text-blue-400 mb-1 flex items-center gap-1">
        📘 الدرس
      </p>
      <p className="text-sm font-bold text-gray-800 leading-snug">{lesson}</p>
      <p className="text-[10px] text-gray-400 mt-1">{subject}</p>
    </motion.div>
  );
}

function VisualNovelScene({
  scenario,
  cfg,
  gradeId,
  onChoice,
  onNext,
  hasNext,
}: {
  scenario: Scenario;
  cfg: (typeof gradeConfig)[4];
  gradeId: number;
  onChoice?: (color: "red" | "yellow" | "green") => void;
  onNext?: () => void;
  hasNext?: boolean;
}) {
  const [step, setStep] = useState<"scene" | "question" | "result">("scene");
  const [chosen, setChosen] = useState<number | null>(null);
  const [emotions, setEmotions] = useState([...IDLE_EMOTIONS]);
  const [justSpoke, setJustSpoke] = useState<number | null>(null);

  const speakAnimation = (idx: number) => {
    setJustSpoke(idx);
    setTimeout(() => setJustSpoke(null), 600);
  };

  const handleContinue = () => {
    speakAnimation(1);
    setStep("question");
  };

  const handleChoice = (idx: number) => {
    const color = scenario.choices[idx].color;
    setChosen(idx);
    setStep("result");
    onChoice?.(color);
    const newEmotions = [...choiceColors[color].emotions];
    setEmotions(newEmotions);
    speakAnimation(0);
  };

  const reset = () => {
    setChosen(null);
    setStep("scene");
    setEmotions([...IDLE_EMOTIONS]);
    setJustSpoke(null);
  };

  const showChar = (scenario.chars ?? []).map((name) => ({
    name,
    image: CHAR_IMAGES[name] ?? charSameh,
  }));

  return (
    <div className="flex flex-col">
      {/* ── Dialogue area (natural height, no flex-1) ── */}
      <div className="px-4 pt-5 pb-4 space-y-3">
        {/* Scenario badge */}
        <div className="flex justify-center">
          <span className="bg-gray-100 text-gray-500 text-[11px] font-bold px-3 py-1 rounded-full">
            🎭 {scenario.title} — {scenario.subject}
          </span>
        </div>

        {/* Main dialogue bubble */}
        <AnimatePresence mode="wait">
          {step === "scene" && (
            <motion.div
              key="scene"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <DialogueBubble
                text={scenario.scene}
                label="السيناريو"
                emoji="📖"
                tail="left"
                accentHex={cfg.accentHex}
              />
            </motion.div>
          )}
          {step === "question" && (
            <motion.div
              key="question"
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <DialogueBubble
                text={scenario.question}
                label="السؤال"
                tail="right"
                accentHex={cfg.accentHex}
              />
              {/* Choices directly below question bubble */}
              <AnimatePresence>
                {chosen === null && (
                  <motion.div
                    key="choices"
                    className="space-y-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="text-[11px] font-black text-gray-400 text-center">
                      اختار ردك:
                    </p>
                    {scenario.choices.map((choice, i) => {
                      const c = choiceColors[choice.color];
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleChoice(i)}
                          className={`w-full text-right px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${c.btn}`}
                        >
                          <span className="ml-2">{c.dot}</span>
                          {choice.label}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {step === "result" && chosen !== null && (
            <motion.div
              key="result"
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <DialogueBubble
                text={scenario.choices[chosen].result}
                label="اللي حصل"
                emoji={choiceColors[scenario.choices[chosen].color].dot}
                tail="left"
                accentHex={cfg.accentHex}
              />
              <LessonCard
                lesson={scenario.lesson}
                subject={scenario.subject}
                accentHex={cfg.accentHex}
              />
              {scenario.studyTip && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3"
                >
                  <p className="text-[11px] font-black text-emerald-500 mb-1 flex items-center gap-1">
                    💡 نصيحة مذاكرة
                  </p>
                  <p className="text-sm font-semibold text-gray-700 leading-snug">
                    {scenario.studyTip}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Character Stage ── */}
      <div className="flex justify-center items-end gap-4 sm:gap-6 px-4 pb-1">
        {showChar.map((char, i) => (
          <CharacterSprite
            key={char.name}
            image={char.image}
            name={char.name}
            isActive={
              step === "result" ? true : step === "scene" ? i === 1 : i === 0
            }
            isSpeaking={justSpoke === i}
            emotion={emotions[i] ?? IDLE_EMOTIONS[i]}
            delay={i * 0.1}
            accentHex={cfg.accentHex}
          />
        ))}
      </div>

      {/* ── Action Bar ── */}
      <div className="px-4 py-3 border-t border-gray-100">
        {step === "scene" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm ${cfg.accent}`}
          >
            إيه اللي هتعمله؟ ←
          </motion.button>
        )}
        {step === "result" && (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-600 transition-colors font-semibold"
            >
              <RotateCcw size={13} /> جرب تاني
            </button>
            {hasNext && onNext && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onNext}
                className={`flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-2xl text-white ${cfg.accent} hover:opacity-90`}
              >
                الموقف الجاي ←
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const CONFETTI_COLORS = [
  "#f97316",
  "#a855f7",
  "#22d3ee",
  "#34d399",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
];

function CelebrationOverlay({
  subjectName,
  onClose,
}: {
  subjectName: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 28 }, (_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              top: "-20px",
              left: `${(i * 37 + 5) % 100}%`,
              width: 8 + (i % 5) * 3,
              height: 8 + (i % 5) * 3,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              opacity: [1, 0.7, 0],
            }}
            transition={{
              duration: 2.2 + (i % 5) * 0.2,
              delay: (i * 0.07) % 1.2,
              ease: "easeIn",
              repeat: Infinity,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl px-8 py-8 text-center max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-3xl font-black text-gray-800 mb-1">أحسنت!</h2>
        <p className="text-gray-500 font-semibold mb-1">خلصت كل مواقف</p>
        <p className="text-xl font-black text-orange-500 mb-5">{subjectName}</p>
        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-2xl text-sm"
        >
          كمّل! ←
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function GradePage({ gradeId }: GradePageProps) {
  const grade = grades.find((g) => g.id === gradeId);
  const cfg = gradeConfig[gradeId];
  const [activeSubject, setActiveSubject] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const [celebratingSubject, setCelebratingSubject] = useState<string | null>(
    null,
  );
  const [gradeComplete, setGradeComplete] = useState(false);
  const { markScenario, progress } = useProgressContext();

  if (!grade || !cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">الصف ده مش موجود</p>
          <Link href="/" className="text-orange-500 font-bold">
            ارجع للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const subject = grade.subjects[activeSubject];
  const safeScenarioIdx = Math.min(
    activeScenario,
    subject.scenarios.length - 1,
  );
  const scenario = subject.scenarios[safeScenarioIdx];

  const goNext = () => {
    if (activeScenario < subject.scenarios.length - 1)
      setActiveScenario((p) => p + 1);
    else if (activeSubject < grade.subjects.length - 1) {
      setActiveSubject((p) => p + 1);
      setActiveScenario(0);
    }
  };

  const allIds = grade.subjects.flatMap((s) => s.scenarios.map((sc) => sc.id));
  const done = allIds.filter((id) => progress.scenarios[id]).length;
  const pct = allIds.length > 0 ? Math.round((done / allIds.length) * 100) : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cfg.bg}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 max-w-3xl mx-auto">
        <Link
          href="/"
          className={`inline-flex items-center gap-1 text-sm font-bold mb-3 ${cfg.accentText}`}
        >
          <ArrowRight size={14} /> الرئيسية
        </Link>

        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800">
            {grade.name}
          </h1>
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${cfg.accent}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <span className={`font-black text-xs ${cfg.accentText}`}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Subject tabs */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {grade.subjects.map((subj, i) => {
            const subDone = subj.scenarios.filter(
              (sc) => progress.scenarios[sc.id],
            ).length;
            const allDone = subDone === subj.scenarios.length;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveSubject(i);
                  setActiveScenario(0);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${i === activeSubject ? cfg.tabActive : "bg-white text-gray-500 shadow-sm border border-gray-200"}`}
              >
                {subj.name}
                <span
                  className={`text-[10px] font-black ${i === activeSubject ? "opacity-80" : "text-gray-400"}`}
                >
                  {allDone ? "✓" : `${subDone}/${subj.scenarios.length}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scenario pills with prev/next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScenario((p) => Math.max(0, p - 1))}
            disabled={safeScenarioIdx === 0}
            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 shrink-0"
          >
            <ChevronRight size={14} />
          </button>

          <div className="flex gap-1.5 overflow-x-auto flex-1 pb-0.5 scrollbar-hide">
            {subject.scenarios.map((s, i) => {
              const result = progress.scenarios[s.id];
              const dot =
                result === "green"
                  ? "🟢"
                  : result === "yellow"
                    ? "🟡"
                    : result === "red"
                      ? "🔴"
                      : null;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(i)}
                  className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 text-[11px] whitespace-nowrap shrink-0 ${i === safeScenarioIdx ? cfg.tabActive : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"}`}
                >
                  {dot && <span className="text-[10px]">{dot}</span>}
                  {i + 1}. {s.title}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setActiveScenario((p) =>
                Math.min(subject.scenarios.length - 1, p + 1),
              )
            }
            disabled={safeScenarioIdx === subject.scenarios.length - 1}
            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:bg-gray-50 shrink-0"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* Visual Novel Card */}
      <div className="max-w-3xl mx-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <VisualNovelScene
              key={scenario.id}
              scenario={scenario}
              cfg={cfg}
              gradeId={gradeId}
              onChoice={(color) => {
                markScenario(scenario.id, color);
                const newProgress = {
                  ...progress.scenarios,
                  [scenario.id]: color,
                };
                const subjectDone = subject.scenarios.every(
                  (sc) => newProgress[sc.id],
                );
                const gradeDone = grade.subjects
                  .flatMap((s) => s.scenarios)
                  .every((sc) => newProgress[sc.id]);
                if (gradeDone) setTimeout(() => setGradeComplete(true), 700);
                else if (subjectDone)
                  setTimeout(() => setCelebratingSubject(subject.name), 600);
              }}
              onNext={goNext}
              hasNext={
                activeScenario < subject.scenarios.length - 1 ||
                activeSubject < grade.subjects.length - 1
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Quick nav to quiz/game */}
        <div className="flex gap-3 justify-center mt-4">
          <Link
            href={`/quiz/${gradeId}`}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold ${cfg.accentLight} ${cfg.accentText} hover:opacity-80 transition-opacity`}
          >
            🎯 الكويز
          </Link>
          <Link
            href={`/game/${gradeId}`}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold ${cfg.accentLight} ${cfg.accentText} hover:opacity-80 transition-opacity`}
          >
            🃏 اللعبة
          </Link>
          <Link
            href={`/truefalse/${gradeId}`}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold ${cfg.accentLight} ${cfg.accentText} hover:opacity-80 transition-opacity`}
          >
            ⚡ صح أو غلط
          </Link>
        </div>
      </div>

      {/* Celebrations */}
      <AnimatePresence>
        {celebratingSubject && !gradeComplete && (
          <CelebrationOverlay
            subjectName={celebratingSubject}
            onClose={() => setCelebratingSubject(null)}
          />
        )}
        {gradeComplete && (
          <motion.div
            key="grade-complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setGradeComplete(false)}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }, (_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: `${(i * 29 + 3) % 100}%`,
                    width: 10 + (i % 6) * 2,
                    height: 10 + (i % 6) * 2,
                    borderRadius: i % 2 === 0 ? "50%" : "2px",
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  }}
                  animate={{
                    y: ["0vh", "115vh"],
                    rotate: [0, 720 * (i % 2 === 0 ? 1 : -1)],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2.5 + (i % 4) * 0.3,
                    delay: (i * 0.05) % 1.5,
                    ease: "easeIn",
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="relative bg-white rounded-3xl shadow-2xl px-8 py-8 text-center max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-7xl mb-3">🌟</div>
              <h2 className="text-4xl font-black text-gray-800 mb-1">رائع!</h2>
              <p className="text-gray-500 font-semibold mb-1">خلصت كل مواقف</p>
              <p className={`text-2xl font-black mb-2 ${cfg.accentText}`}>
                {grade.name}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                أنت بطل فعلي! كملت كل المواقف في الصف ده 🎊
              </p>
              <div className="flex gap-3">
                <Link
                  href="/achievements"
                  className={`flex-1 ${cfg.accent} text-white font-black py-2.5 rounded-2xl text-sm hover:opacity-90`}
                  onClick={() => setGradeComplete(false)}
                >
                  شاراتي ←
                </Link>
                <button
                  onClick={() => setGradeComplete(false)}
                  className="flex-1 bg-gray-100 text-gray-600 font-black py-2.5 rounded-2xl text-sm hover:bg-gray-200"
                >
                  شكراً!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
