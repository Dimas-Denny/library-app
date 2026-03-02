type Props = {
  name: string;
  email: string;
  createdAt?: string;
  borrowedCount: number;
  returnedCount: number;
  reviewCount: number;
};

export default function ProfileSummaryCard({
  name,
  email,
  createdAt,
  borrowedCount,
  returnedCount,
  reviewCount,
}: Props) {
  const memberSince = createdAt
    ? new Date(createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6">
      {/* ================= USER INFO ================= */}
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-black/5 flex items-center justify-center text-2xl font-bold text-black">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xl font-semibold">{name}</p>
          <p className="text-sm text-black/50">{email}</p>
          <p className="text-xs text-black/40 mt-1">
            Member since {memberSince}
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-black/5 rounded-2xl py-4">
          <p className="text-2xl font-bold">{borrowedCount}</p>
          <p className="text-xs text-black/50 mt-1">Borrowed</p>
        </div>

        <div className="bg-black/5 rounded-2xl py-4">
          <p className="text-2xl font-bold">{returnedCount}</p>
          <p className="text-xs text-black/50 mt-1">Returned</p>
        </div>

        <div className="bg-black/5 rounded-2xl py-4">
          <p className="text-2xl font-bold">{reviewCount}</p>
          <p className="text-xs text-black/50 mt-1">Reviews</p>
        </div>
      </div>
    </div>
  );
}
