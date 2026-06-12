"use client";

import { Check, Droplets, HelpCircle, TreePine, Waves, Zap } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "hidrica", label: "Amenaza hídrica", sublabel: "Ríos, cuencas, contaminación", icon: Droplets, color: "#1565c0", bg: "#e3f2fd", border: "#1565c0" },
  { id: "deforestacion", label: "Deforestación", sublabel: "Tala, quema, pérdida de bosque", icon: TreePine, color: "#2e7d32", bg: "#d8f3dc", border: "#2e7d32" },
  { id: "mineria", label: "Minería ilegal", sublabel: "Retroexcavadoras, dragas, mercurio", icon: Zap, color: "#d32f2f", bg: "#fddede", border: "#d32f2f" },
  { id: "fauna", label: "Fauna y flora", sublabel: "Caza ilegal, especies en riesgo", icon: Waves, color: "#2e7d32", bg: "#c8e6c9", border: "#388e3c" },
  { id: "otro", label: "Otro", sublabel: "Amenaza no listada", icon: HelpCircle, color: "#7a756e", bg: "#f0eae0", border: "#bab4ac" },
] as const;

type ScitaReportCategorySectionProps = {
  initialCategory?: string;
};

export function ScitaReportCategorySection({ initialCategory = "" }: ScitaReportCategorySectionProps) {
  const validInitial = categories.some((cat) => cat.id === initialCategory) ? initialCategory : "";
  const [selectedCategory, setSelectedCategory] = useState(validInitial);

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;

        return (
          <label key={cat.id} className="relative cursor-pointer">
            <input
              type="radio"
              name="categoria"
              value={cat.id}
              checked={isSelected}
              onChange={() => setSelectedCategory(cat.id)}
              className="peer sr-only"
              required
            />
            <div
              className={`relative flex flex-col gap-2 rounded-[20px] border-2 p-4 transition-all duration-200 ${
                isSelected
                  ? "scale-[1.02] border-[3px] shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
                  : "border-[#e8dfd3] bg-white hover:border-[#d4c8b8] hover:bg-[#faf8f5]"
              }`}
              style={
                isSelected
                  ? {
                      borderColor: cat.border,
                      background: cat.bg,
                      boxShadow: `0 10px 28px rgba(0,0,0,0.14), 0 0 0 4px ${cat.border}40`,
                    }
                  : undefined
              }
            >
              {isSelected ? (
                <span
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
                  style={{ background: cat.border }}
                  aria-hidden="true"
                >
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
              ) : null}

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isSelected ? "bg-white shadow-sm" : ""
                }`}
                style={{ background: isSelected ? "white" : cat.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden="true" />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${isSelected ? "" : "text-[#1a1a1a]"}`}
                  style={isSelected ? { color: cat.color } : undefined}
                >
                  {cat.label}
                </p>
                <p className={`mt-0.5 text-[11px] leading-4 ${isSelected ? "text-[#4a4540]" : "text-[#7a756e]"}`}>
                  {cat.sublabel}
                </p>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
