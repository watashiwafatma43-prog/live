import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, RotateCcw, Trophy, Zap } from "lucide-react";
import { matchGames } from "@/data/quizData";
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
  }
> = {
  4: {
    bg: "from-orange-50 via-amber-50 to-white",
    accent: "bg-orange-500",
    accentLight: "bg-orange-100",
    accentText: "text-orange-600",
    charBorder: "#f97316",
    charGrad: "from-orange-100 to-amber-50",
  },
  5: {
    bg: "from-purple-50 via-violet-50 to-white",
    accent: "bg-purple-500",
    accentLight: "bg-purple-100",
    accentText: "text-purple-600",
    charBorder: "#a855f7",
    charGrad: "from-purple-100 to-violet-50",
  },
  6: {
    bg: "from-sky-50 via-cyan-50 to-white",
    accent: "bg-sky-500",
    accentLight: "bg-sky-100",
    accentText: "text-sky-600",
    charBorder: "#0ea5e9",
    charGrad: "from-sky-100 to-cyan-50",
  },
};

const gradeHosts: Record<number, { name: string; chars: string[] }> = {
  4: { name: "هالة", chars: ["سامح", "نور", "عمر"] },
  5: { name: "سارة", chars: ["كريم", "زياد", "محمود"] },
  6: { name: "نادية", chars: ["مازن", "سيف", "منة"] },
};

type CardState = "hidden" | "flipped" | "matched";

interface CardData {
  id: string;
  pairId: string;
  text: string;
  type: "scenario" | "lesson";
  emoji: string;
}

function buildCards(gradeId: number): CardData[] {
  const game = matchGames.find((g) => g.gradeId === gradeId);
  if (!game) return [];
  const cards: CardData[] = [];
  game.cards.forEach((c) => {
    cards.push({
      id: `s-${c.id}`,
      pairId: c.id,
      text: c.scenario,
      type: "scenario",
      emoji: c.emoji,
    });
    cards.push({
      id: `l-${c.id}`,
      pairId: c.id,
      text: c.lesson,
      type: "lesson",
      emoji: "📘",
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

function FloatingChar({
  name,
  charBorder,
  charGrad,
  emotion,
  delay = 0,
}: {
  name: string;
  charBorder: string;
  charGrad: string;
  emotion: string;
  delay?: number;
}) {
  const img = charImages[name];
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
      className="flex flex-col items-center gap-1"
    >
      <div className="relative">
        {img ? (
          <div
            className="overflow-hidden flex items-center justify-center"
            style={{ width: 64, height: 84 }}
          >
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
            className={`rounded-2xl bg-gradient-to-b ${charGrad} flex items-end justify-center pb-2 shadow-md`}
            style={{
              border: `2px dashed ${charBorder}`,
              width: 64,
              height: 84,
            }}
          >
            <div
              className="w-8 h-10 rounded-xl opacity-25"
              style={{ background: charBorder }}
            />
          </div>
        )}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
          className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-sm"
        >
          {emotion}
        </motion.div>
      </div>
      <span className="text-xs font-black text-gray-500">{name}</span>
    </motion.div>
  );
}

export default function GamePage({ gradeId }: { gradeId: number }) {
  const cfg = gradeConfig[gradeId];
  const host = gradeHosts[gradeId];
  const { saveGameScore } = useProgressContext();
  const [cards, setCards] = useState<CardData[]>(() => buildCards(gradeId));
  const [states, setStates] = useState<Record<string, CardState>>(() =>
    Object.fromEntries(
      buildCards(gradeId).map((c) => [c.id, "hidden" as CardState]),
    ),
  );
  const [flipped, setFlipped] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [finished, setFinished] = useState(false);

  const totalPairs = cards.length / 2;

  const reset = () => {
    const newCards = buildCards(gradeId);
    setCards(newCards);
    setStates(
      Object.fromEntries(newCards.map((c) => [c.id, "hidden" as CardState])),
    );
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setLastResult(null);
    setFinished(false);
  };

  const handleFlip = (id: string) => {
    if (states[id] !== "hidden" || flipped.length === 2) return;
    const newFlipped = [...flipped, id];
    setStates((s) => ({ ...s, [id]: "flipped" }));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = cards.find((c) => c.id === b)!;

      if (cardA.pairId === cardB.pairId && cardA.type !== cardB.type) {
        setLastResult("correct");
        setStates((s) => ({ ...s, [a]: "matched", [b]: "matched" }));
        setFlipped([]);
        const newMatched = matched + 1;
        setMatched(newMatched);
        if (newMatched === totalPairs) {
          const finalScore = Math.max(
            0,
            Math.round(100 - (moves + 1 - totalPairs) * 5),
          );
          saveGameScore(gradeId, finalScore);
          setTimeout(() => setFinished(true), 600);
        }
      } else {
        setLastResult("wrong");
        setTimeout(() => {
          setStates((s) => ({ ...s, [a]: "hidden", [b]: "hidden" }));
          setFlipped([]);
          setLastResult(null);
        }, 900);
      }
    }
  };

  const score = Math.max(0, Math.round(100 - (moves - totalPairs) * 5));
  const medal =
    score >= 90 ? "🥇" : score >= 70 ? "🥈" : score >= 50 ? "🥉" : "💪";

  const charEmotions =
    lastResult === "correct"
      ? ["🥳", "😄", "🎉"]
      : lastResult === "wrong"
        ? ["😬", "😅", "🙈"]
        : ["🤔", "😊", "💡"];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cfg.bg}`}>
      <div className="px-4 pt-4 pb-2 max-w-4xl mx-auto">
        <Link
          href={`/grade/${gradeId}`}
          className={`inline-flex items-center gap-1 text-sm font-bold mb-3 ${cfg.accentText}`}
        >
          <ArrowRight size={14} /> الصف
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <h1 className="font-black text-gray-800 text-2xl">لعبة المطابقة</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
            <span
              className={`px-3 py-1 rounded-full ${cfg.accentLight} ${cfg.accentText}`}
            >
              {matched}/{totalPairs} جوزة
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {moves} محاولة
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-10">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Instructions bubble */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start mb-5 mt-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0">
                  💬
                </div>
                <div className="speech-bubble-left text-sm text-gray-700">
                  <p className="font-bold text-gray-500 text-xs mb-0.5">
                    {host.name} بتقول:
                  </p>
                  طابق كل <strong>موقف</strong> مع <strong>الدرس</strong>{" "}
                  المناسب ليه! دور على الأزواج المتشابهة 🃏
                </div>
              </motion.div>

              <div className="flex gap-4 items-start">
                {/* Left chars */}
                <div className="hidden sm:flex flex-col gap-5 shrink-0 pt-4">
                  <FloatingChar
                    name={host.chars[0]}
                    charBorder={cfg.charBorder}
                    charGrad={cfg.charGrad}
                    emotion={charEmotions[0]}
                    delay={0}
                  />
                  <FloatingChar
                    name={host.chars[2]}
                    charBorder={cfg.charBorder}
                    charGrad={cfg.charGrad}
                    emotion={charEmotions[2]}
                    delay={1.2}
                  />
                </div>

                {/* Card grid */}
                <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {cards.map((card) => {
                    const state = states[card.id];
                    const isFlipped =
                      state === "flipped" || state === "matched";
                    return (
                      <motion.div
                        key={card.id}
                        whileTap={{ scale: state === "hidden" ? 0.95 : 1 }}
                        onClick={() => handleFlip(card.id)}
                        className={`relative cursor-pointer rounded-2xl transition-all ${state === "hidden" ? "cursor-pointer" : "cursor-default"}`}
                        style={{ aspectRatio: "3/4", perspective: 600 }}
                      >
                        <motion.div
                          animate={{ rotateY: isFlipped ? 0 : 180 }}
                          transition={{ duration: 0.35 }}
                          style={{
                            transformStyle: "preserve-3d",
                            width: "100%",
                            height: "100%",
                            position: "relative",
                          }}
                        >
                          {/* Front (shown when flipped) */}
                          <div
                            style={{
                              backfaceVisibility: "hidden",
                              position: "absolute",
                              inset: 0,
                            }}
                            className={`rounded-2xl flex flex-col items-center justify-center p-2 text-center border-2 shadow-sm ${
                              state === "matched"
                                ? "bg-green-50 border-green-300"
                                : card.type === "scenario"
                                  ? "bg-amber-50 border-amber-200"
                                  : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <span className="text-2xl mb-1">{card.emoji}</span>
                            <p
                              className={`text-xs font-bold leading-tight ${state === "matched" ? "text-green-700" : card.type === "scenario" ? "text-amber-800" : "text-blue-800"}`}
                            >
                              {card.text}
                            </p>
                            {state === "matched" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1 left-1 text-green-500 text-sm"
                              >
                                ✓
                              </motion.div>
                            )}
                          </div>

                          {/* Back (card face-down) */}
                          <div
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                              position: "absolute",
                              inset: 0,
                              borderColor: cfg.charBorder + "55",
                            }}
                            className={`rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm ${cfg.accentLight} hover:shadow-md transition-shadow`}
                          >
                            <span className="text-3xl opacity-50">🎲</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right char */}
                <div className="hidden sm:flex flex-col gap-5 shrink-0 pt-4">
                  <FloatingChar
                    name={host.chars[1]}
                    charBorder={cfg.charBorder}
                    charGrad={cfg.charGrad}
                    emotion={charEmotions[1]}
                    delay={0.6}
                  />
                </div>
              </div>

              {/* Feedback flash */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-white font-black text-lg shadow-xl ${lastResult === "correct" ? "bg-green-500" : "bg-red-400"}`}
                  >
                    {lastResult === "correct"
                      ? "🎉 صح! زوج ممتاز!"
                      : "❌ مش الجوزة دي... جرب تاني!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Win screen */
            <motion.div
              key="win"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8 }}
                className="text-8xl mb-4"
              >
                {medal}
              </motion.div>
              <h2 className="font-black text-gray-800 text-3xl mb-1">
                أنهيت اللعبة! 🎊
              </h2>
              <p className={`font-bold text-lg ${cfg.accentText} mb-2`}>
                طابقت {totalPairs} جوزة في {moves} محاولة
              </p>
              <div className="flex gap-2 items-center mb-8">
                <Zap size={16} className="text-yellow-400" />
                <span className="font-black text-gray-600">
                  نقاط الأداء: {score}/100
                </span>
              </div>

              {/* Celebrating chars */}
              <div className="flex gap-8 mb-8">
                {host.chars.map((c, i) => (
                  <FloatingChar
                    key={c}
                    name={c}
                    charBorder={cfg.charBorder}
                    charGrad={cfg.charGrad}
                    emotion={["🥳", "🎉", "🙌"][i]}
                    delay={i * 0.4}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
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
      </div>
    </div>
  );
}
