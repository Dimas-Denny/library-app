import React from "react";
import { Link } from "react-router-dom";

import Fiction from "@/assets/svg/fiction.svg";
import NonFiction from "@/assets/svg/non-fiction.svg";
import Self from "@/assets/svg/self.svg";
import Finance from "@/assets/svg/finance.svg";
import Science from "@/assets/svg/science.svg";
import Education from "@/assets/svg/education.svg";

type CategoryItem = {
  id: number;
  label: string;
  icon: string;
};

export default function CategorySection() {
  const items: CategoryItem[] = React.useMemo(
    () => [
      { id: 1, label: "Fiction", icon: Fiction },
      { id: 2, label: "Non-Fiction", icon: NonFiction },
      { id: 7, label: "Self-Improvement", icon: Self },
      { id: 3, label: "Finance", icon: Finance },
      { id: 4, label: "Science", icon: Science },
      { id: 5, label: "Education", icon: Education },
    ],
    [],
  );

  return (
    <section className="py-4 md:py-6 space-y-4">
      <h2 className="text-2xl font-bold">Category</h2>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
        {items.map((cat) => (
          <Link
            key={cat.id}
            to={`/books?categoryId=${cat.id}`}
            className="
              rounded-2xl bg-white
              p-3 md:p-4
              shadow-[0_18px_35px_rgba(0,0,0,0.07)]
              transition
              hover:shadow-[0_22px_45px_rgba(0,0,0,0.09)]
              active:scale-[0.98]
            "
          >
            <div className="flex w-full items-center justify-center rounded-xl bg-[#E0ECFF] h-14 md:h-12">
              <img
                src={cat.icon}
                alt={cat.label}
                className="h-11 w-11 md:h-12 md:w-12"
              />
            </div>

            <p className="mt-2 text-xs md:text-[11px] font-bold text-black text-center">
              {cat.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
