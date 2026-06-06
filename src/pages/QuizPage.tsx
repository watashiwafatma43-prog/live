import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, Trophy, Star } from "lucide-react";
import { quizzes } from "@/data/quizData";
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

const charImages: Record<string, string> = {
  سارة: charSara,
  كريم: charKarim,
  نور: charNoor,
  منة: charMona,
  هالة: charHala,
  نادية: charLeila,
  عمر: charOmar,
  سامح: charSameh,
  زياد: charZiad,
  سيف: charSeif,
  مازن: charMazen,
  محمود: charMahmoud,
};

const gradeConfig: Record<
  number,
  {
    bg: string;
    accent: string;
    accentLight: string;
    accentText: string;
    charBorder: string;
    charGrad: string;
    tabActive: string;
  }
> = {
  4: {
    bg: "from-orange-50 via-amber-50 to-white",
    accent: "bg-orange-500",
    accentLight: "bg-orange-100",
    accentText: "text-orange-600",
    charBorder: "#f97316",
    charGrad: "from-orange-100 to-amber-50",
    tabActive: "bg-orange-500 text-white",
  },
  5: {
    bg: "from-purple-50 via-violet-50 to-white",
    accent: "bg-purple-500",
    accentLight: "bg-purple-100",
    accentText: "text-purple-600",
    charBorder: "#a855f7",
    charGrad: "from-purple-100 to-violet-50",
    tabActive: "bg-purple-500 text-white",
  },
  6: {
    bg: "from-sky-50 via-cyan-50 to-white",
    accent: "bg-sky-500",
    accentLight: "bg-sky-100",
    accentText: "text-sky-600",
    charBorder: "#0ea5e9",
    charGrad: "from-sky-100 to-cyan-50",
    tabActive: "bg-sky-500 text-white",
  },
};

const hostEmotions: Record<
  string,
  { idle: string; correct: string; wrong: string; thinking: string }
> = {
  عمر: { idle: "😄", correct: "🥳", wrong: "😬", thinking: "🤔" },
  كريم: { idle: "🤓", correct: "🎉", wrong: "😅", thinking: "💭" },
  مازن: { idle: "💡", correct: "🙌", wrong: "😮", thinking: "🧐" },
};

interface FloatingHostProps {
  name: string;
  emotion: string;
  charBorder: string;
  charGrad: string;
}

function FloatingHost({
  name,
  emotion,
  charBorder,
  charGrad,
}: FloatingHostProps) {
  const img = charImages[name];
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        {img ? (
          <div className="w-24 h-32 overflow-hidden flex items-center justify-center">
            <img
              src={img}
              alt={name}
              className="w-full h-full object-contain"
              style={{
                imageRendering: "pixelated",
                transform: "scale(1.5)",
                transformOrigin: "center 60%",
              }}
            />
          </div>
        ) : (
          <div
            className={`w-24 h-32 rounded-3xl bg-gradient-to-b ${charGrad} flex flex-col items-center justify-end pb-3 shadow-lg`}
            style={{ border: `3px dashed ${charBorder}` }}
          >
            <div
              className="w-12 h-14 rounded-2xl opacity-25"
              style={{ background: charBorder }}
            />
          </div>
        )}
        <motion.div
          key={emotion}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-xl"
        >
          {emotion}
        </motion.div>
      </div>
      <span className="text-sm font-black text-gray-600">{name}</span>
      <span className="text-xs text-gray-400 font-semibold">المضيف</span>
    </motion.div>
  );
}

export default function QuizPage({ gradeId }: { gradeId: number }) {
  const quiz = quizzes.find((q) => q.gradeId === gradeId);
  const cfg = gradeConfig[gradeId];
  const { saveQuizScore } = useProgressContext();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hostEmotion, setHostEmotion] = useState<string>("");
  const [answers, setAnswers] = useState<boolean[]>([]);

  if (!quiz || !cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/" className="text-orange-500 font-bold">
          الرئيسية
        </Link>
      </div>
    );
  }

  const emotions = hostEmotions[quiz.host.name] ?? {
    idle: "😄",
    correct: "🥳",
    wrong: "😬",
    thinking: "🤔",
  };
  const question = quiz.questions[currentQ];
  const currentEmotion =
    hostEmotion ||
    (selected === null
      ? emotions.idle
      : selected === question.correct
        ? emotions.correct
        : emotions.wrong);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === question.correct;
    setHostEmotion(isCorrect ? emotions.correct : emotions.wrong);
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => [...a, isCorrect]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= quiz.questions.length) {
      saveQuizScore(gradeId, Math.round((score / quiz.questions.length) * 100));
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setHostEmotion(emotions.thinking);
      setTimeout(() => setHostEmotion(""), 800);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setHostEmotion("");
    setAnswers([]);
  };

  const pct = Math.round((score / quiz.questions.length) * 100);
  const medal = pct === 100 ? "🥇" : pct >= 70 ? "🥈" : pct >= 50 ? "🥉" : "💪";
  const praise =
    pct === 100
      ? "ممتاز! إنت نجم حقيقي!"
      : pct >= 70
        ? "كويس جداً! قريب من القمة!"
        : pct >= 50
          ? "مش بطال! تقدر أحسن كمان"
          : "جرب تاني وهتبقى أحسن!";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cfg.bg}`}>
      <div className="px-4 pt-4 pb-2 max-w-3xl mx-auto">
        <Link
          href={`/grade/${gradeId}`}
          className={`inline-flex items-center gap-1 text-sm font-bold mb-3 ${cfg.accentText}`}
        >
          <ArrowRight size={14} /> {quiz.gradeName}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h1 className="font-black text-gray-800 text-2xl">
            كويز {quiz.gradeName}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-5 items-start mt-4"
            >
              {/* Host */}
              <div className="hidden sm:block shrink-0 pt-6">
                <FloatingHost
                  name={quiz.host.name}
                  emotion={currentEmotion}
                  charBorder={cfg.charBorder}
                  charGrad={cfg.charGrad}
                />
              </div>

              {/* Quiz card */}
              <div className="flex-1">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-4">
                  {quiz.questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        i < currentQ
                          ? answers[i]
                            ? "bg-green-400"
                            : "bg-red-300"
                          : i === currentQ
                            ? cfg.accent
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-bold ${cfg.accentText} mb-4`}>
                  سؤال {currentQ + 1} من {quiz.questions.length}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Chat header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.accentLight} ${cfg.accentText}`}
                      >
                        {question.subject}
                      </span>
                    </div>

                    {/* Question as chat bubble */}
                    <div className="p-5 space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0">
                          🎯
                        </div>
                        <div className="speech-bubble-left max-w-sm">
                          <p className="font-bold text-gray-800 text-sm leading-relaxed">
                            {question.question}
                          </p>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 mt-3">
                        {question.options.map((opt, i) => {
                          let style =
                            "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700";
                          if (selected !== null) {
                            if (i === question.correct)
                              style =
                                "border-green-400 bg-green-50 text-green-800";
                            else if (
                              i === selected &&
                              selected !== question.correct
                            )
                              style = "border-red-300 bg-red-50 text-red-700";
                            else
                              style =
                                "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                          }
                          return (
                            <motion.button
                              key={i}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSelect(i)}
                              className={`w-full text-right px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all flex items-center gap-2 ${style}`}
                            >
                              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                                {selected !== null && i === question.correct
                                  ? "✓"
                                  : selected !== null && i === selected
                                    ? "✗"
                                    : ["أ", "ب", "ج", "د"][i]}
                              </span>
                              {opt}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <AnimatePresence>
                        {selected !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm shrink-0">
                                📘
                              </div>
                              <div className="speech-bubble-left bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                                <p className="text-xs font-bold text-blue-400 mb-1">
                                  الدرس
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={handleNext}
                              className={`w-full mt-4 py-3 rounded-2xl text-white font-bold text-sm ${cfg.accent} transition-all`}
                            >
                              {currentQ + 1 < quiz.questions.length
                                ? "السؤال الجاي ←"
                                : "شوف نتيجتك 🎉"}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Results screen */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.8 }}
                className="text-7xl mb-4"
              >
                {medal}
              </motion.div>
              <h2 className="font-black text-gray-800 text-3xl mb-1">
                {praise}
              </h2>
              <p className={`font-bold text-lg ${cfg.accentText} mb-6`}>
                {score} من {quiz.questions.length} إجابة صح
              </p>

              {/* Score ring */}
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={
                      pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#f97316"
                    }
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100),
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-800">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Answer recap */}
              <div className="flex gap-2 mb-6">
                {answers.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${a ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                  >
                    {a ? "✓" : "✗"}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={14} /> كرر الكويز
                </button>
                <Link
                  href={`/game/${gradeId}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm ${cfg.accent} transition-colors`}
                >
                  <Trophy size={14} /> جرب الألعاب
                </Link>
                <Link
                  href={`/grade/${gradeId}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight size={14} /> ارجع للمواقف
                </Link>
              </div>

              <Link
                href={`/grade/${gradeId}`}
                className={`mt-4 text-sm font-bold ${cfg.accentText}`}
              >
                ← ارجع للمواقف
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stars decoration */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed pointer-events-none text-yellow-300 text-xl"
            style={{ left: `${10 + i * 20}%`, top: `${15 + (i % 2) * 10}%` }}
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <Star size={12} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
