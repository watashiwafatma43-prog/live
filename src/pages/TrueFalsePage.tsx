import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, Zap, Trophy } from "lucide-react";
import { trueFalseGames } from "@/data/quizData";
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
    host: string;
    hostFriend: string;
  }
> = {
  4: {
    bg: "from-orange-50 via-amber-50 to-white",
    accent: "bg-orange-500",
    accentLight: "bg-orange-100",
    accentText: "text-orange-600",
    charBorder: "#f97316",
    charGrad: "from-orange-100 to-amber-50",
    host: "هالة",
    hostFriend: "عمر",
  },
  5: {
    bg: "from-purple-50 via-violet-50 to-white",
    accent: "bg-purple-500",
    accentLight: "bg-purple-100",
    accentText: "text-purple-600",
    charBorder: "#a855f7",
    charGrad: "from-purple-100 to-violet-50",
    host: "كريم",
    hostFriend: "زياد",
  },
  6: {
    bg: "from-sky-50 via-cyan-50 to-white",
    accent: "bg-sky-500",
    accentLight: "bg-sky-100",
    accentText: "text-sky-600",
    charBorder: "#0ea5e9",
    charGrad: "from-sky-100 to-cyan-50",
    host: "مازن",
    hostFriend: "نادية",
  },
};

const TIMER_SECS = 10;

function CharAvatar({
  name,
  emotion,
  charGrad,
  charBorder,
  delay = 0,
}: {
  name: string;
  emotion: string;
  charGrad: string;
  charBorder: string;
  delay?: number;
}) {
  const img = charImages[name];
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
      className="flex flex-col items-center gap-1"
    >
      <div className="relative">
        {img ? (
          <div
            className="overflow-hidden flex items-center justify-center"
            style={{ width: 88, height: 112 }}
          >
            <img
              src={img}
              alt={name}
              className="w-full h-full object-contain"
              style={{
                imageRendering: "pixelated",
                transform: "scale(1.8)",
                transformOrigin: "center 55%",
              }}
            />
          </div>
        ) : (
          <div
            className={`rounded-2xl bg-gradient-to-b ${charGrad} flex items-end justify-center pb-2`}
            style={{
              border: `2px dashed ${charBorder}`,
              width: 88,
              height: 112,
            }}
          >
            <div
              className="w-8 h-12 rounded-xl opacity-25"
              style={{ background: charBorder }}
            />
          </div>
        )}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: delay + 0.3 }}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs"
        >
          {emotion}
        </motion.div>
      </div>
      <span className="text-[10px] font-black text-gray-400">{name}</span>
    </motion.div>
  );
}

export default function TrueFalsePage({ gradeId }: { gradeId: number }) {
  const cfg = gradeConfig[gradeId];
  const { saveTFScore } = useProgressContext();
  const gameData = trueFalseGames.find((g) => g.gradeId === gradeId);
  const questions = gameData?.questions ?? [];

  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [timerActive, setTimerActive] = useState(true);

  const current = questions[idx];

  const handleAnswer = useCallback(
    (userSayTrue: boolean) => {
      if (answered !== null || !current) return;
      setTimerActive(false);
      const correct = userSayTrue === current.isTrue;
      const speedBonus = Math.round((timeLeft / TIMER_SECS) * 5);
      const pts = correct ? 10 + speedBonus : 0;
      setAnswered(userSayTrue);
      setWasCorrect(correct);
      setScore((s) => s + pts);
      setResults((r) => [...r, correct]);
    },
    [answered, current, timeLeft],
  );

  useEffect(() => {
    if (finished || answered !== null || !timerActive) return;
    if (timeLeft <= 0) {
      handleAnswer(!current.isTrue);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, answered, timerActive, handleAnswer, current]);

  const goNext = () => {
    if (idx + 1 >= questions.length) {
      const pct = Math.round(
        (results.filter(Boolean).length / questions.length) * 100,
      );
      saveTFScore(gradeId, pct);
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setTimeLeft(TIMER_SECS);
      setAnswered(null);
      setWasCorrect(null);
      setTimerActive(true);
    }
  };

  const reset = () => {
    setIdx(0);
    setTimeLeft(TIMER_SECS);
    setAnswered(null);
    setWasCorrect(null);
    setScore(0);
    setFinished(false);
    setResults([]);
    setTimerActive(true);
  };

  if (!gameData || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">مفيش أسئلة لهذا الصف</p>
      </div>
    );
  }

  const correctCount = results.filter(Boolean).length;
  const finalPct =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
  const medal =
    finalPct >= 90
      ? "🥇"
      : finalPct >= 70
        ? "🥈"
        : finalPct >= 50
          ? "🥉"
          : "💪";
  const charEmotion = wasCorrect === null ? "🤔" : wasCorrect ? "🥳" : "😬";
  const friendEmotion = wasCorrect === null ? "😊" : wasCorrect ? "🎉" : "😅";
  const timerColor =
    timeLeft > 6
      ? "bg-green-400"
      : timeLeft > 3
        ? "bg-yellow-400"
        : "bg-red-400";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cfg.bg}`}>
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
        <Link
          href={`/grade/${gradeId}`}
          className={`inline-flex items-center gap-1 text-sm font-bold mb-3 ${cfg.accentText}`}
        >
          <ArrowRight size={14} /> الصف
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="font-black text-gray-800 text-xl">صح أو غلط؟</h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span
              className={`px-3 py-1 rounded-full ${cfg.accentLight} ${cfg.accentText}`}
            >
              {idx + 1}/{questions.length}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-1">
              <Zap size={12} /> {score}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Timer bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4 mt-2">
                <motion.div
                  className={`h-full rounded-full transition-colors ${timerColor}`}
                  animate={{ width: `${(timeLeft / TIMER_SECS) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Progress dots */}
              <div className="flex gap-1 justify-center mb-4">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < results.length
                        ? results[i]
                          ? "bg-green-400"
                          : "bg-red-400"
                        : i === idx
                          ? "bg-gray-400"
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Characters */}
              <div className="flex justify-center gap-6 mb-4">
                <CharAvatar
                  name={cfg.host}
                  emotion={charEmotion}
                  charGrad={cfg.charGrad}
                  charBorder={cfg.charBorder}
                  delay={0}
                />
                <CharAvatar
                  name={cfg.hostFriend}
                  emotion={friendEmotion}
                  charGrad={cfg.charGrad}
                  charBorder={cfg.charBorder}
                  delay={0.8}
                />
              </div>

              {/* Statement card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className={`bg-white rounded-3xl shadow-xl border-2 p-6 text-center mb-4 ${
                    answered === null
                      ? "border-gray-100"
                      : wasCorrect
                        ? "border-green-300"
                        : "border-red-300"
                  }`}
                >
                  <div className="text-4xl mb-3">{current.emoji}</div>
                  <p className="text-lg font-bold text-gray-800 leading-relaxed mb-2">
                    {current.statement}
                  </p>
                  {answered !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-2xl text-sm font-semibold ${wasCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {wasCorrect
                        ? "🎉 صح!"
                        : `❌ ${current.isTrue ? "الجواب صح" : "الجواب غلط"}`}
                      <p className="mt-1 text-xs font-normal text-gray-500">
                        {current.explanation}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Buttons */}
              {answered === null ? (
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(true)}
                    className="py-5 rounded-3xl bg-green-500 text-white font-black text-xl shadow-lg hover:bg-green-600 transition-colors"
                  >
                    ✅ صح
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(false)}
                    className="py-5 rounded-3xl bg-red-500 text-white font-black text-xl shadow-lg hover:bg-red-600 transition-colors"
                  >
                    ❌ غلط
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={goNext}
                  className={`w-full py-4 rounded-3xl text-white font-black text-lg shadow-lg ${cfg.accent}`}
                >
                  {idx + 1 >= questions.length
                    ? "شوف النتيجة ←"
                    : "السؤال الجاي ←"}
                </motion.button>
              )}

              {/* Timer indicator */}
              <div className="flex justify-center mt-4">
                <div
                  className={`text-3xl font-black transition-colors ${
                    timeLeft > 6
                      ? "text-green-500"
                      : timeLeft > 3
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {timeLeft}
                </div>
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
                animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8 }}
                className="text-7xl mb-3"
              >
                {medal}
              </motion.div>
              <h2 className="font-black text-gray-800 text-3xl mb-1">
                انتهت اللعبة!
              </h2>
              <p className={`font-bold text-lg ${cfg.accentText} mb-1`}>
                {correctCount} صح من {questions.length}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="font-black text-gray-600">{score} نقطة</span>
              </div>
              <div
                className={`text-4xl font-black mb-4 ${finalPct >= 70 ? "text-green-500" : "text-orange-500"}`}
              >
                {finalPct}%
              </div>

              {/* Result dots breakdown */}
              <div className="flex gap-2 mb-6">
                {results.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${r ? "bg-green-400" : "bg-red-400"}`}
                  >
                    {r ? "✓" : "✗"}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  <RotateCcw size={14} /> العب تاني
                </button>
                <Link
                  href={`/quiz/${gradeId}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm ${cfg.accent}`}
                >
                  <Trophy size={14} /> جرب الكويز
                </Link>
                <Link
                  href={`/game/${gradeId}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  🃏 لعبة المطابقة
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
