import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  User,
  Brain,
  Star,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useProgressContext } from "@/context/ProgressContext";

import c1 from "@assets/Untitled32_1777692293179.png";
import c2 from "@assets/Untitled33_(1)_1777692293181.png";
import c3 from "@assets/Untitled34_1777692293183.png";
import c4 from "@assets/Untitled35_1777692293186.png";
import c5 from "@assets/Untitled36_(1)_1777692293189.png";
import c6 from "@assets/Untitled38_1777692293193.png";
import c7 from "@assets/Untitled39_1777692293195.png";
import c8 from "@assets/Untitled40_1777692293198.png";
import c9 from "@assets/Untitled41_1777692293200.png";
import c10 from "@assets/Untitled48_1777692994658.png";
import c11 from "@assets/Untitled43_1777692994655.png";
import c12 from "@assets/Untitled50_1777692315693.png";

const AVATARS = [
  { id: "a1", img: c1, label: "ليلى" },
  { id: "a2", img: c2, label: "وليد" },
  { id: "a3", img: c3, label: "نور" },
  { id: "a4", img: c4, label: "رنا" },
  { id: "a5", img: c5, label: "سلمى" },
  { id: "a6", img: c6, label: "هدى" },
  { id: "a7", img: c7, label: "باسم" },
  { id: "a8", img: c8, label: "لانا" },
  { id: "a9", img: c9, label: "ريم" },
  { id: "a10", img: c10, label: "أحمد" },
  { id: "a11", img: c11, label: "سارة" },
  { id: "a12", img: c12, label: "كريم" },
];

interface DayEvent {
  id: string;
  time: string;
  icon: string;
  situation: string;
  choices: { text: string; traits: Record<string, number>; subject?: string }[];
}

const DAY_EVENTS: DayEvent[] = [
  {
    id: "e1",
    time: "الصباح — في الطريق للمدرسة",
    icon: "🌅",
    situation:
      "في الأتوبيس، صاحبك بدأ يتكلم بصوت عالي وبيضحك على واحد تاني. الناس كلها بتبص.",
    choices: [
      { text: "تضحك معاه وتشجعه", traits: { جرأة: 2, تعاطف: -2, مسؤولية: -1 } },
      { text: "تسكت وتبص في التليفون", traits: { هدوء: 2, شجاعة: -1 } },
      {
        text: "تهمس له بهدوء: 'ده مش وقته'",
        traits: { شجاعة: 2, تعاطف: 2, حكمة: 1 },
        subject: "اللغة العربية",
      },
    ],
  },
  {
    id: "e2",
    time: "أول حصة — اللغة العربية",
    icon: "📖",
    situation: "المدرس طلب من حد يقرأ فقرة صعبة. السكوت ملى الفصل.",
    choices: [
      {
        text: "ترفع إيدك وتحاول",
        traits: { شجاعة: 3, ثقة: 2 },
        subject: "اللغة العربية",
      },
      { text: "تستنى حد تاني", traits: { هدوء: 1, شجاعة: -1 } },
      { text: "تتظاهر إنك مش واخد بالك", traits: { شجاعة: -2, ثقة: -1 } },
    ],
  },
  {
    id: "e3",
    time: "الفسحة",
    icon: "🌿",
    situation: "لقيت محفظة فيها فلوس على الأرض في الممر. مفيش حد حواليك.",
    choices: [
      {
        text: "تاخد الفلوس، هي على الأرض أصلاً",
        traits: { أمانة: -3, مسؤولية: -2 },
      },
      { text: "تسيبها وتمشي", traits: { مسؤولية: -1 } },
      {
        text: "تاخدها وتوديها لإدارة المدرسة",
        traits: { أمانة: 3, مسؤولية: 3 },
        subject: "الدراسات الاجتماعية",
      },
    ],
  },
  {
    id: "e4",
    time: "حصة العلوم",
    icon: "🔬",
    situation: "المدرسة طلبت مشروع جماعي عن البيئة. فريقك مش متفق على أي فكرة.",
    choices: [
      { text: "تفرض فكرتك وخلاص", traits: { قيادة: 1, تعاون: -2 } },
      { text: "تسكت وتخليهم يتفقوا", traits: { هدوء: 1, قيادة: -1 } },
      {
        text: "تقترح تصوتوا على الأفضل",
        traits: { قيادة: 2, تعاون: 3, حكمة: 2 },
        subject: "العلوم",
      },
    ],
  },
  {
    id: "e5",
    time: "الغداء",
    icon: "🥗",
    situation: "صاحبك قالك إنه ناسي غداه. عندك بس أنت اللي تكفيك.",
    choices: [
      { text: "تاكل لوحدك بسرعة", traits: { تعاطف: -2 } },
      {
        text: "تعزمه يأكل معاك",
        traits: { تعاطف: 3, كرم: 3 },
        subject: "الدراسات الاجتماعية",
      },
      { text: "تقوله يشتري من الكانتين", traits: { مسؤولية: 1 } },
    ],
  },
  {
    id: "e6",
    time: "حصة الرياضيات",
    icon: "🔢",
    situation:
      "المدرس شرح موضوع جديد وإنت مش فاهم خالص. زملائك شايلين الموضوع.",
    choices: [
      { text: "تتظاهر إنك فاهم وتسكت", traits: { ثقة: -2, مسؤولية: -1 } },
      {
        text: "تسأل المدرس بعد الحصة",
        traits: { مسؤولية: 2, ثقة: 2, شجاعة: 1 },
        subject: "الرياضيات",
      },
      { text: "تكتب السؤال وتسأل صاحبك", traits: { تعاون: 2, مسؤولية: 1 } },
    ],
  },
  {
    id: "e7",
    time: "آخر النهار — في الشارع",
    icon: "🌇",
    situation: "شفت واحد بيرمي زبالة على الأرض قدام عمارتك.",
    choices: [
      { text: "تطنش وتعدي", traits: { مسؤولية: -2, جرأة: -1 } },
      {
        text: "تنبهه بأدب: 'في زبالة هنا'",
        traits: { شجاعة: 2, مسؤولية: 2, تعاطف: 1 },
        subject: "العلوم",
      },
      { text: "تشيل الزبالة نفسك بصمت", traits: { مسؤولية: 3, كرم: 1 } },
    ],
  },
  {
    id: "e8",
    time: "المساء — المذاكرة",
    icon: "📚",
    situation: "عندك امتحان بكرة وإنت تعبان ومحتاج تنام. المادة كتير.",
    choices: [
      {
        text: "تنام وتصحى بدري تذاكر",
        traits: { حكمة: 2, مسؤولية: 2, تنظيم: 3 },
        subject: "الرياضيات",
      },
      { text: "تسهر تذاكر كل حاجة", traits: { مسؤولية: 1, تنظيم: -1 } },
      {
        text: "تلعب شوية الأول وبعدين تذاكر",
        traits: { تنظيم: -2, مسؤولية: -1 },
      },
    ],
  },
];

type TraitScores = Record<string, number>;
type SubjectScores = Record<string, number>;

interface PersonalityProfile {
  type: string;
  emoji: string;
  strengths: string[];
  toImprove: { trait: string; subject: string; tip: string }[];
  color: string;
  description: string;
}

function buildProfile(
  traits: TraitScores,
  subjects: SubjectScores,
): PersonalityProfile {
  const top = Object.entries(traits).sort((a, b) => b[1] - a[1]);
  const topTrait = top[0]?.[0] ?? "شجاعة";
  const topScore = top[0]?.[1] ?? 0;
  const secondTrait = top[1]?.[0] ?? "حكمة";

  const weakness = Object.entries(traits).sort((a, b) => a[1] - b[1]);
  const worstTrait = weakness[0]?.[0] ?? "";
  const worstScore = weakness[0]?.[1] ?? 0;

  let type = "المتوازن";
  let emoji = "⚖️";
  let color = "from-purple-500 to-violet-600";
  let description =
    "شخصية متوازنة بتجمع بين الحكمة والتعاطف. إنت من الناس اللي بيشوفوا الصورة الكاملة قبل ما ياخدوا أي قرار.";

  if (topScore >= 6) {
    if (topTrait === "شجاعة" || topTrait === "جرأة") {
      type = "الجريء";
      emoji = "🦁";
      color = "from-orange-500 to-red-500";
      description =
        "عندك قدرة على مواجهة المواقف الصعبة من غير ما تتراجع. الشجاعة دي مش بتيجي من الفراغ — هي بتيجي من إيمانك بالصح.";
    } else if (topTrait === "تعاطف" || topTrait === "كرم") {
      type = "القلب الطيب";
      emoji = "💚";
      color = "from-green-500 to-emerald-600";
      description =
        "إنت من النوع اللي بيحس بالناس وبيهتم بيهم بجد. ده مش ضعف — ده قوة بتخليك تبني علاقات حقيقية وتأثير دايم.";
    } else if (topTrait === "مسؤولية" || topTrait === "أمانة") {
      type = "الموثوق";
      emoji = "🛡️";
      color = "from-blue-500 to-sky-600";
      description =
        "الناس بتعتمد عليك لأنك بتوفي بكلامك. الأمانة والمسؤولية دول الأساس اللي عليه بتتبنى الثقة في أي علاقة.";
    } else if (topTrait === "قيادة" || topTrait === "تنظيم") {
      type = "القائد";
      emoji = "🌟";
      color = "from-yellow-500 to-amber-600";
      description =
        "عندك موهبة إنك تنظم وتوجه الناس. القيادة الحقيقية مش في الأوامر — هي في الإلهام والمثال.";
    } else if (topTrait === "حكمة") {
      type = "الحكيم";
      emoji = "🧠";
      color = "from-indigo-500 to-purple-600";
      description =
        "بتفكر قبل ما تتكلم وبتشوف الأمور من زوايا مختلفة. الحكمة دي هي أغلى حاجة ممكن تتعلمها.";
    }
  }

  const strengths: string[] = top
    .slice(0, 3)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
  const subjectRec: Record<string, { subject: string; tip: string }> = {
    شجاعة: {
      subject: "اللغة العربية",
      tip: "شارك في الإلقاء والمناقشات — صوتك مهم.",
    },
    جرأة: {
      subject: "اللغة العربية",
      tip: "اشترك في التعبير الشفهي — الكلام الواثق بيبين.",
    },
    تعاطف: {
      subject: "الدراسات الاجتماعية",
      tip: "ادرس دروس المواطنة والتعاون — هتلاقي نفسك فيها.",
    },
    كرم: {
      subject: "الدراسات الاجتماعية",
      tip: "دروس المجتمع والحقوق هتناسبك جداً.",
    },
    مسؤولية: {
      subject: "الدراسات الاجتماعية",
      tip: "ذاكر حقوق وواجبات المواطن — هتتمكن أكتر.",
    },
    أمانة: {
      subject: "التربية الإسلامية",
      tip: "ركز على قيم الصدق والأمانة اللي في المنهج.",
    },
    قيادة: {
      subject: "الرياضيات",
      tip: "الرياضيات بتبني التفكير المنطقي اللي كل قائد محتاجه.",
    },
    تنظيم: {
      subject: "الرياضيات",
      tip: "المسائل بتحتاج تنظيم وخطوات — وده موهبتك.",
    },
    حكمة: {
      subject: "العلوم",
      tip: "العلوم بتحتاج تحليل وتفكير نقدي — هتبرع فيها.",
    },
    تعاون: {
      subject: "العلوم",
      tip: "المشاريع الجماعية في العلوم هتناسبك تماماً.",
    },
    هدوء: {
      subject: "الرياضيات",
      tip: "الهدوء بيساعدك تحل المسائل الصعبة بتركيز.",
    },
    ثقة: {
      subject: "اللغة العربية",
      tip: "حاول تكتب قصص قصيرة — ثقتك بنفسك هتظهر فيها.",
    },
  };

  const toImprove: { trait: string; subject: string; tip: string }[] = weakness
    .filter(([, v]) => v <= 0)
    .slice(0, 2)
    .map(([k]) => ({
      trait: k,
      subject: subjectRec[k]?.subject ?? "الدراسات الاجتماعية",
      tip: subjectRec[k]?.tip ?? "ركز على هذه المادة هتساعدك تطور نفسك.",
    }));

  return { type, emoji, strengths, toImprove, color, description };
}

type Phase = "pick-avatar" | "pick-name" | "game" | "result";

export default function PersonalityGamePage() {
  const { savePersonalityScore } = useProgressContext();
  const [phase, setPhase] = useState<Phase>("pick-avatar");
  const [avatar, setAvatar] = useState<(typeof AVATARS)[0] | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [eventIdx, setEventIdx] = useState(0);
  const [traits, setTraits] = useState<TraitScores>({});
  const [subjects, setSubjects] = useState<SubjectScores>({});
  const [chosenSubject, setChosenSubject] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [, navigate] = useLocation();

  const currentEvent = DAY_EVENTS[eventIdx];

  const handleChoose = (choiceIdx: number) => {
    if (showFeedback) return;
    setSelectedChoice(choiceIdx);
    setShowFeedback(true);
    const choice = currentEvent.choices[choiceIdx];
    const newTraits = { ...traits };
    Object.entries(choice.traits).forEach(([k, v]) => {
      newTraits[k] = (newTraits[k] ?? 0) + v;
    });
    setTraits(newTraits);
    if (choice.subject) {
      const newSub = { ...subjects };
      newSub[choice.subject] = (newSub[choice.subject] ?? 0) + 1;
      setSubjects(newSub);
      setChosenSubject((p) => [...p, choice.subject]);
    }
  };

  const handleNext = () => {
    if (eventIdx + 1 >= DAY_EVENTS.length) {
      const p = buildProfile(traits, subjects);
      setProfile(p);
      savePersonalityScore(1);
      setPhase("result");
    } else {
      setEventIdx((i) => i + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
  };

  const reset = () => {
    setPhase("pick-avatar");
    setAvatar(null);
    setPlayerName("");
    setNameInput("");
    setEventIdx(0);
    setTraits({});
    setSubjects({});
    setChosenSubject([]);
    setSelectedChoice(null);
    setShowFeedback(false);
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold mb-3 text-indigo-600"
        >
          <ArrowRight size={14} /> الرئيسية
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🧠</span>
          <h1 className="font-black text-gray-800 text-xl">
            لعبة بناء الشخصية
          </h1>
        </div>
        {phase === "game" && (
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{
                  width: `${((eventIdx + 1) / DAY_EVENTS.length) * 100}%`,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs text-gray-500 font-bold">
              {eventIdx + 1}/{DAY_EVENTS.length}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {/* ── PHASE 1: Pick Avatar ── */}
          {phase === "pick-avatar" && (
            <motion.div
              key="pick-avatar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-600 font-semibold text-base">
                  اختار شخصيتك اللي هتعيش اليوم بيها 👇
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {AVATARS.map((av) => (
                  <motion.button
                    key={av.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAvatar(av)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${
                      avatar?.id === av.id
                        ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
                        : "border-gray-100 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="w-16 h-20 overflow-hidden flex items-center justify-center">
                      <img
                        src={av.img}
                        alt={av.label}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      {av.label}
                    </span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={!avatar}
                onClick={() => setPhase("pick-name")}
                className={`w-full py-4 rounded-3xl font-black text-lg text-white shadow-lg transition-all ${
                  avatar
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
              >
                التالي ←
              </motion.button>
            </motion.div>
          )}

          {/* ── PHASE 2: Enter Name ── */}
          {phase === "pick-name" && avatar && (
            <motion.div
              key="pick-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center mb-8 mt-4">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="w-28 h-36 overflow-hidden flex items-center justify-center mb-4"
                >
                  <img
                    src={avatar.img}
                    alt="avatar"
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </motion.div>
                <p className="text-gray-700 font-bold text-lg mb-1">
                  إيه اسمك؟
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  الاسم ده هيكون في تقرير شخصيتك
                </p>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  maxLength={20}
                  className="w-full max-w-xs text-center text-xl font-bold border-2 border-indigo-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 bg-white mb-6"
                  dir="rtl"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={!nameInput.trim()}
                  onClick={() => {
                    setPlayerName(nameInput.trim());
                    setPhase("game");
                  }}
                  className={`w-full max-w-xs py-4 rounded-3xl font-black text-lg text-white shadow-lg ${
                    nameInput.trim()
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  ابدأ اليوم ←
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── PHASE 3: Game Events ── */}
          {phase === "game" && avatar && (
            <motion.div
              key={`event-${eventIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Time / situation header */}
              <div className="bg-white rounded-2xl border-2 border-indigo-100 px-4 py-3 mb-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{currentEvent.icon}</span>
                <div>
                  <p className="text-xs text-indigo-500 font-bold">
                    {currentEvent.time}
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {currentEvent.situation}
                  </p>
                </div>
              </div>

              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-18 overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ height: 72 }}
                >
                  <img
                    src={avatar.img}
                    alt="you"
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="bg-indigo-50 rounded-2xl px-4 py-2 text-sm font-bold text-indigo-800 border border-indigo-100">
                  {playerName}، هتعمل إيه؟
                </div>
              </div>

              {/* Choices */}
              <div className="flex flex-col gap-3 mb-4">
                {currentEvent.choices.map((c, i) => {
                  const isSelected = selectedChoice === i;
                  const isOther = showFeedback && selectedChoice !== i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleChoose(i)}
                      disabled={showFeedback}
                      className={`w-full text-right px-5 py-4 rounded-2xl border-2 font-bold text-base transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : isOther
                            ? "border-gray-100 bg-gray-50 opacity-40"
                            : "border-gray-100 bg-white hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            isSelected
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span>{c.text}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && selectedChoice !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 mb-4 text-sm text-indigo-700 font-semibold"
                  >
                    {(() => {
                      const c = currentEvent.choices[selectedChoice];
                      const topPos = Object.entries(c.traits)
                        .filter(([, v]) => v > 0)
                        .map(([k]) => k);
                      const topNeg = Object.entries(c.traits)
                        .filter(([, v]) => v < 0)
                        .map(([k]) => k);
                      return (
                        <>
                          {topPos.length > 0 && (
                            <p>
                              ✨ قوّيت صفة: <strong>{topPos.join("، ")}</strong>
                            </p>
                          )}
                          {topNeg.length > 0 && (
                            <p className="text-rose-600">
                              ⚠️ خففت من: <strong>{topNeg.join("، ")}</strong>
                            </p>
                          )}
                          {c.subject && (
                            <p className="text-green-700 mt-1">
                              📚 مرتبط بـ: <strong>{c.subject}</strong>
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {showFeedback && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleNext}
                  className="w-full py-4 rounded-3xl bg-indigo-500 text-white font-black text-lg shadow-lg"
                >
                  {eventIdx + 1 >= DAY_EVENTS.length
                    ? "شوف شخصيتك ←"
                    : "الموقف الجاي ←"}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── PHASE 4: Result ── */}
          {phase === "result" && profile && avatar && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Header card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-gradient-to-br ${profile.color} rounded-3xl p-6 text-white text-center mb-5 shadow-xl`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-24 h-32 overflow-hidden mx-auto mb-3 flex items-center justify-center"
                >
                  <img
                    src={avatar.img}
                    alt="you"
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </motion.div>
                <div className="text-5xl mb-2">{profile.emoji}</div>
                <p className="text-white/80 text-sm font-bold mb-1">
                  أنت من نوع...
                </p>
                <h2 className="text-3xl font-black">
                  {playerName} — {profile.type}
                </h2>
                <p className="text-white/90 text-sm mt-3 leading-relaxed">
                  {profile.description}
                </p>
              </motion.div>

              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl border-2 border-green-100 p-5 mb-4 shadow-sm"
              >
                <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
                  <Star size={18} className="text-green-500" /> نقاط قوتك
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <span
                      key={s}
                      className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-bold"
                    >
                      ✨ {s}
                    </span>
                  ))}
                  {profile.strengths.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      اتعمد في مواقف أكتر عشان تظهر قوتك!
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Improvement areas */}
              {profile.toImprove.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-3xl border-2 border-amber-100 p-5 mb-4 shadow-sm"
                >
                  <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
                    <Brain size={18} className="text-amber-500" /> هنا ممكن
                    تتطور أكتر
                  </h3>
                  <div className="flex flex-col gap-3">
                    {profile.toImprove.map((item) => (
                      <div
                        key={item.trait}
                        className="bg-amber-50 rounded-2xl p-3 border border-amber-100"
                      >
                        <p className="font-bold text-amber-800 text-sm mb-1">
                          ⚡ {item.trait} — ركز على{" "}
                          <span className="text-indigo-600">
                            {item.subject}
                          </span>
                        </p>
                        <p className="text-amber-700 text-xs">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Trait bars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl border-2 border-gray-100 p-5 mb-5 shadow-sm"
              >
                <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-500" /> تفاصيل
                  شخصيتك
                </h3>
                {Object.entries(traits)
                  .sort((a, b) => b[1] - a[1])
                  .map(([trait, score]) => {
                    const maxPossible = 9;
                    const normalised = Math.max(
                      0,
                      Math.min(
                        100,
                        ((score + maxPossible) / (maxPossible * 2)) * 100,
                      ),
                    );
                    const barColor =
                      score >= 3
                        ? "bg-green-400"
                        : score >= 0
                          ? "bg-yellow-400"
                          : "bg-rose-400";
                    return (
                      <div key={trait} className="mb-2">
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>{trait}</span>
                          <span
                            className={
                              score >= 0 ? "text-green-600" : "text-rose-500"
                            }
                          >
                            {score > 0 ? "+" : ""}
                            {score}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${barColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${normalised}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  🔄 جرب تاني بشخصية مختلفة
                </button>
                <Link
                  href="/"
                  className="w-full py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm text-center"
                >
                  🏠 الرئيسية
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
