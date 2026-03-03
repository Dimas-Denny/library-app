type Props = {
  active: "BORROWED" | "USER" | "BOOK";
  onChange: (v: "BORROWED" | "USER" | "BOOK") => void;
};

export default function AdminTabs({ active, onChange }: Props) {
  const tabs = [
    { key: "BORROWED", label: "Borrowed List" },
    { key: "USER", label: "User" },
    { key: "BOOK", label: "Book List" },
  ] as const;

  return (
    <div className="inline-flex bg-black/5 rounded-full p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-2 rounded-full text-sm transition ${
            active === tab.key ? "bg-white shadow text-black" : "text-black/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
