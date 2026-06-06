import { User } from "lucide-react";

interface CharacterPlaceholderProps {
  name: string;
  trait: string;
  color: string;
  borderColor: string;
  size?: "sm" | "md" | "lg";
}

export default function CharacterPlaceholder({ name, trait, color, borderColor, size = "md" }: CharacterPlaceholderProps) {
  const sizes = {
    sm: { container: "h-28 w-24", icon: 28, text: "text-xs" },
    md: { container: "h-40 w-32", icon: 40, text: "text-sm" },
    lg: { container: "h-52 w-40", icon: 52, text: "text-sm" },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${s.container} rounded-2xl flex flex-col items-center justify-center gap-2 relative overflow-hidden`}
        style={{ background: color, border: `2px dashed ${borderColor}` }}
      >
        <div
          className="rounded-full p-3 opacity-60"
          style={{ background: borderColor + "33" }}
        >
          <User size={s.icon} color={borderColor} />
        </div>
        <span className={`${s.text} text-center font-semibold opacity-70 px-2`} style={{ color: borderColor }}>
          قريباً
        </span>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{trait}</p>
      </div>
    </div>
  );
}
