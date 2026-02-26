import React from "react";
import { Link } from "react-router-dom";

import Fiction from "@/assets/svg/fiction.svg";
import NonFiction from "@/assets/svg/non-fiction.svg";
import Self from "@/assets/svg/self.svg";
import Finance from "@/assets/svg/finance.svg";
import Science from "@/assets/svg/science.svg";
import Education from "@/assets/svg/education.svg";

const iconByKey = {
  fiction: Fiction,
  "non-fiction": NonFiction,
  self: Self,
  finance: Finance,
  science: Science,
  education: Education,
} as const;

type IconKey = keyof typeof iconByKey;

type UIItem = {
  key: IconKey;
  label: string;
};

function normalizeKey(input: string) {
  return input.toLowerCase().replace(/[^a-z]/g, "");
}

function formatLabel(label: string) {
  if (normalizeKey(label).includes("self")) return "Self-\nImprovement";
  return label;
}

export default function CategorySection() {
  const items: UIItem[] = React.useMemo(
    () => [
      { key: "fiction", label: "Fiction" },
      { key: "non-fiction", label: "Non-Fiction" },
      { key: "self", label: "Self-Improvement" },
      { key: "finance", label: "Finance" },
      { key: "science", label: "Science" },
      { key: "education", label: "Education" },
    ],
    [],
  );

  return (
    <section className="py-4 md:py-6">
      <div
        className="
          grid grid-cols-3 gap-4
          md:grid-cols-6 md:gap-6
        "
      >
        {items.map((cat) => {
          const Icon = iconByKey[cat.key];
          const to = `/books?categoryKey=${encodeURIComponent(cat.key)}`;

          return (
            <Link
              key={cat.key}
              to={to}
              className="
                rounded-2xl bg-white
                p-3 md:p-4
                shadow-[0_18px_35px_rgba(0,0,0,0.07)]
                transition
                hover:shadow-[0_22px_45px_rgba(0,0,0,0.09)]
                active:scale-[0.98]
              "
            >
              <div
                className="
                  flex w-full items-center justify-center
                  rounded-xl bg-[#E0ECFF]
                  h-14 md:h-12
                "
              >
                <img
                  src={Icon}
                  alt={cat.label}
                  className="h-11.2 w-11.2 md:h-12.8 md:w-12.8"
                  width={42}
                  height={42}
                />
              </div>

              <p
                className="
                  mt-2 md:mt-2
                  whitespace-pre-line
                  text-xs md:text-[11px]
                  font-bold leading-snug
                  text-black
                "
              >
                {formatLabel(cat.label)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
