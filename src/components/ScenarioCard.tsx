import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, BookOpen } from "lucide-react";
import type { Scenario } from "@/data/content";

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
}

const colorMap = {
  red: {
    btn: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    result: "result-red",
    dot: "bg-red-500",
    emoji: "🔴",
  },
  yellow: {
    btn: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
    result: "result-yellow",
    dot: "bg-yellow-500",
    emoji: "🟡",
  },
  green: {
    btn: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
    result: "result-green",
    dot: "bg-green-500",
    emoji: "🟢",
  },
};

export default function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const [chosen, setChosen] = useState<number | null>(null);

  const reset = () => setChosen(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-l from-amber-50 to-orange-50 p-5 border-b border-orange-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎭</span>
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{scenario.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{scenario.subject}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Scene */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed text-[15px]">{scenario.scene}</p>
        </div>

        <AnimatePresence mode="wait">
          {chosen === null ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="font-bold text-gray-700">{scenario.question}</p>
              <div className="space-y-2">
                {scenario.choices.map((choice, i) => {
                  const c = colorMap[choice.color];
                  return (
                    <button
                      key={i}
                      onClick={() => setChosen(i)}
                      className={`w-full text-right px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all scenario-btn ${c.btn}`}
                    >
                      <span className="ml-2">{c.emoji}</span>
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className={`rounded-xl p-4 ${colorMap[scenario.choices[chosen].color].result}`}>
                <p className="font-bold text-gray-700 text-sm mb-1">
                  {colorMap[scenario.choices[chosen].color].emoji} اخترت: {scenario.choices[chosen].label}
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">{scenario.choices[chosen].result}</p>
              </div>

              {/* Lesson */}
              <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-2">
                  <BookOpen size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-blue-500 font-bold mb-1">الدرس</p>
                    <p className="text-gray-700 font-semibold text-sm leading-relaxed">{scenario.lesson}</p>
                    <p className="text-xs text-gray-500 mt-1">{scenario.subject}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors mx-auto"
              >
                <RotateCcw size={14} />
                جرب خيار تاني
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
