import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface GradeSelectProps {
  onSelect: () => void;
}

const grades = [
  {
    id: "primary",
    label: "ابتدائي",
    icon: "🏫",
    available: true,
  },
  {
    id: "middle",
    label: "اعدادي",
    icon: "📚",
    available: false,
  },
  {
    id: "secondary",
    label: "ثانوي",
    icon: "🎓",
    available: false,
  },
];

export default function GradeSelect({ onSelect }: GradeSelectProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "#0a0a08",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cairo', sans-serif",
        padding: "24px",
        direction: "rtl",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        .grade-card-available {
          background: linear-gradient(135deg, #1a1a14 0%, #2a2510 100%);
          border: 2px solid #ff9900;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .grade-card-available:hover {
          background: linear-gradient(135deg, #2a2510 0%, #3a3515 100%);
          box-shadow: 0 8px 32px rgba(255, 153, 0, 0.35);
          transform: translateY(-4px);
        }
        .grade-card-locked {
          background: linear-gradient(135deg, #111110 0%, #181814 100%);
          border: 2px solid #2a2a28;
          cursor: not-allowed;
          opacity: 0.45;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <p style={{ color: "#999", fontSize: "0.8rem", marginBottom: "8px", fontWeight: 500 }}>
          اهلاً بيك في
        </p>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 800,
            marginBottom: "10px",
            lineHeight: 1.3,
          }}
        >
          منهجنا لايف 🎒
        </h1>
        <p style={{ color: "#888", fontSize: "0.85rem", fontWeight: 500 }}>
          اختار مرحلتك الدراسية
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        {grades.map((grade, i) => (
          <motion.div
            key={grade.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={grade.available ? "grade-card-available" : "grade-card-locked"}
            onClick={() => grade.available && onSelect()}
            style={{
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "2rem" }}>{grade.icon}</span>
              <div>
                <p
                  style={{
                    color: grade.available ? "#ffffff" : "#555",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {grade.label}
                </p>
                {!grade.available && (
                  <p
                    style={{
                      color: "#555",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      margin: "4px 0 0",
                    }}
                  >
                    قريباً ⏳
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {grade.available ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9900"
                  strokeWidth="2.5"
                  style={{ transform: "rotate(180deg)" }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              ) : (
                <Lock size={18} color="#444" />
              )}
            </div>

            {grade.available && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(255,153,0,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          color: "#444",
          fontSize: "0.72rem",
          marginTop: "32px",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        المراحل الأخرى هتكون متاحة قريباً 🚀
      </motion.p>
    </div>
  );
}
