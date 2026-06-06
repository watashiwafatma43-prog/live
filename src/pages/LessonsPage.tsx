import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { grades } from "@/data/content";
import { useProgressContext } from "@/context/ProgressContext";

const gradeConfig: Record<
  number,
  {
    accent: string;
    accentLight: string;
    accentText: string;
    border: string;
    subjectBg: string;
    ring: string;
  }
> = {
  4: {
    accent: "bg-orange-500",
    accentLight: "bg-orange-50",
    accentText: "text-orange-600",
    border: "border-orange-200",
    subjectBg: "bg-orange-50",
    ring: "#f97316",
  },
  5: {
    accent: "bg-purple-500",
    accentLight: "bg-purple-50",
    accentText: "text-purple-600",
    border: "border-purple-200",
    subjectBg: "bg-purple-50",
    ring: "#a855f7",
  },
  6: {
    accent: "bg-sky-500",
    accentLight: "bg-sky-50",
    accentText: "text-sky-600",
    border: "border-sky-200",
    subjectBg: "bg-sky-50",
    ring: "#0ea5e9",
  },
};

const choiceEmoji: Record<string, string> = {
  green: "🟢",
  yellow: "🟡",
  red: "🔴",
};

export default function LessonsPage() {
  const { progress } = useProgressContext();
  const [search, setSearch] = useState("");

  const completedIds = Object.keys(progress.scenarios);
  const totalCompleted = completedIds.length;

  const allLessons = grades.flatMap((g) =>
    g.subjects.flatMap((s) =>
      s.scenarios
        .filter((sc) => completedIds.includes(sc.id))
        .map((sc) => ({
          ...sc,
          gradeId: g.id,
          gradeName: g.name,
          gradeIcon: g.icon,
          subjectName: s.name,
          choice: progress.scenarios[sc.id],
        })),
    ),
  );

  const searchLower = search.toLowerCase().trim();
  const filtered = searchLower
    ? allLessons.filter(
        (l) =>
          l.lesson.toLowerCase().includes(searchLower) ||
          l.title.toLowerCase().includes(searchLower) ||
          l.subjectName.includes(search) ||
          l.gradeName.includes(search),
      )
    : allLessons;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
      <div className="px-4 pt-4 pb-2 max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold mb-3 text-indigo-500"
        >
          <ArrowRight size={14} /> الرئيسية
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">📖</span>
          <h1 className="font-black text-gray-800 text-2xl">دفتر الدروس</h1>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          {totalCompleted === 0
            ? "لسه ما اتعلمتيش دروس — ابدأ من المواقف!"
            : `عندك ${totalCompleted} درس اتعلمته من المواقف دي`}
        </p>

        {totalCompleted > 0 && (
          <div className="relative mb-5">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ابحث في دروسك..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-9 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {totalCompleted === 0 && (
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="font-black text-gray-600 text-lg mb-2">
              الدفتر فاضي لسه!
            </p>
            <p className="text-gray-400 text-sm mb-6">
              لما تعمل اختيار في أي موقف، الدرس بتاعه هيتحفظ هنا.
            </p>
            <Link
              href="/grade/4"
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-2xl text-sm"
            >
              <BookOpen size={14} /> ابدأ بالصف الرابع
            </Link>
          </motion.div>
        </div>
      )}

      {totalCompleted > 0 && search && filtered.length === 0 && (
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-gray-100 p-10 text-center"
          >
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-black text-gray-600 mb-1">مش لاقي نتائج</p>
            <p className="text-gray-400 text-sm">جرب كلمة تانية</p>
          </motion.div>
        </div>
      )}

      {totalCompleted > 0 && (!search || filtered.length > 0) && (
        <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
          {search ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-xs text-gray-400 font-bold mb-3">
                {filtered.length} نتيجة لـ "{search}"
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {filtered.map((lesson, i) => {
                  const cfg = gradeConfig[lesson.gradeId];
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      className="px-4 py-3 flex gap-3 items-start"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        📘
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center gap-1 flex-wrap">
                          {choiceEmoji[lesson.choice] ?? "⚪"} {lesson.title}
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${cfg.accentLight} ${cfg.accentText}`}
                          >
                            {lesson.gradeName}
                          </span>
                        </p>
                        <p className="text-sm font-bold text-gray-800 leading-snug">
                          {lesson.lesson}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            grades.map((grade) => {
              const cfg = gradeConfig[grade.id];
              const gradeLessons = filtered.filter(
                (l) => l.gradeId === grade.id,
              );
              if (gradeLessons.length === 0) return null;
              return (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{grade.icon}</span>
                    <h2 className="font-black text-gray-800 text-lg">
                      {grade.name}
                    </h2>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${cfg.accentLight} ${cfg.accentText}`}
                    >
                      {gradeLessons.length} درس
                    </span>
                  </div>

                  {grade.subjects.map((subj) => {
                    const subjLessons = gradeLessons.filter(
                      (l) => l.subjectName === subj.name,
                    );
                    if (subjLessons.length === 0) return null;
                    return (
                      <div
                        key={subj.name}
                        className={`rounded-2xl border ${cfg.border} overflow-hidden mb-3`}
                      >
                        <div
                          className={`px-4 py-2 ${cfg.subjectBg} flex items-center gap-2`}
                        >
                          <span className="text-sm">
                            {subj.scenarios[0]?.subject?.split(" ")[0] ?? "📘"}
                          </span>
                          <span
                            className={`font-black text-sm ${cfg.accentText}`}
                          >
                            {subj.name}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {subjLessons.length}/{subj.scenarios.length}
                          </span>
                        </div>
                        <div className="divide-y divide-gray-100 bg-white">
                          {subjLessons.map((lesson, i) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -8 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05, duration: 0.2 }}
                              className="px-4 py-3 flex gap-3 items-start"
                            >
                              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-sm shrink-0 mt-0.5">
                                📘
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center gap-1">
                                  {choiceEmoji[lesson.choice] ?? "⚪"}{" "}
                                  {lesson.title}
                                </p>
                                <p className="text-sm font-bold text-gray-800 leading-snug">
                                  {lesson.lesson}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })
          )}
          <p className="text-center text-xs text-gray-400 font-semibold pb-2">
            الدروس بتتحفظ على جهازك تلقائياً 💾
          </p>
        </div>
      )}
    </div>
  );
}
