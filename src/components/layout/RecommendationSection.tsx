import Temp from "@/assets/png/temp.png";

type DummyBook = {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover: string;
};

export default function RecommendationSection() {
  const books: DummyBook[] = Array.from({ length: 10 }).map((_, i) => ({
    id: String(i + 1),
    title: "Book Name",
    author: "Author name",
    rating: 4.9,
    cover: Temp,
  }));

  return (
    <section className="mt-8 border-b border-black/10 pb-10">
      <h2 className="text-2xl font-bold">Recommendation</h2>

      <div
        className="
          mt-5
          grid grid-cols-2 gap-4
          md:grid-cols-5 md:gap-6
        "
      >
        {books.map((b) => (
          <div
            key={b.id}
            className="
              overflow-hidden rounded-xl bg-white
              shadow-[0_12px_30px_rgba(0,0,0,0.06)]
              transition
              hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]
              active:scale-[0.99]
            "
          >
            {/* Cover */}
            <div className="relative h-52 md:h-44">
              <img
                src={b.cover}
                alt={b.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-semibold leading-snug">{b.title}</p>
              <p className="mt-1 text-xs text-black/45">{b.author}</p>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black/60">
                <span className="text-accent-yellow">★</span>
                <span>{b.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="
            h-9 rounded-full border border-black/10
            bg-white px-10 text-sm font-medium
            transition hover:bg-primary-100
          "
        >
          Load More
        </button>
      </div>
    </section>
  );
}
