import React from "react";
import welcome from "@/assets/png/welcome.png";
import welcome1 from "@/assets/png/welcome1.png";
import welcome2 from "@/assets/png/welcome2.png";

const slides: string[] = [welcome, welcome1, welcome2];

export default function HeroSlider() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      {/* viewport */}
      <div className="relative w-full overflow-hidden rounded-sm">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, idx) => (
            <div
              key={idx}
              className="
          relative w-full shrink-0
          h-40
          md:h-auto md:aspect-1200/441
        "
            >
              <img
                src={src}
                alt={`Welcome ${idx + 1}`}
                className="absolute inset-0 h-full w-full object-contain md:object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="mt-2 flex justify-center gap-2">
        {slides.map((_, idx) => {
          const active = idx === current;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                active ? "w-4 bg-primary-300" : "w-2 bg-gray-300"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
