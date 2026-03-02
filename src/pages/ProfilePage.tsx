import React from "react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/users.api";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const token = useAppSelector((s) => s.auth.token);
  const [editOpen, setEditOpen] = React.useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: !!token,
  });

  const profile = data?.profile;
  const loanStats = data?.loanStats;
  const reviewsCount = data?.reviewsCount;

  return (
    <div className="px-4 md:px-16 py-8 space-y-10">
      {/* ================= TABS ================= */}
      <ProfileTabs />

      <h1 className="text-2xl font-bold">Profile</h1>

      {/* ================= LOADING ================= */}
      {isLoading && <p className="text-sm text-black/50">Loading profile...</p>}

      {/* ================= ERROR ================= */}
      {isError && (
        <p className="text-sm text-red-500">Failed to load profile.</p>
      )}

      {/* ================= CONTENT ================= */}
      {!isLoading && profile && (
        <>
          {/* SUMMARY CARD */}
          <ProfileSummaryCard
            name={profile.name}
            email={profile.email}
            createdAt={profile.createdAt}
            borrowedCount={loanStats?.borrowed ?? 0}
            returnedCount={loanStats?.returned ?? 0}
            reviewCount={reviewsCount ?? 0}
          />

          {/* DETAIL CARD */}
          <div className="max-w-2xl bg-white rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-8">
            {/* BASIC INFO */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Name</span>
                <span className="font-medium">{profile.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-black/50">Email</span>
                <span className="font-medium">{profile.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-black/50">Phone</span>
                <span className="font-medium">{profile.phone ?? "-"}</span>
              </div>
            </div>

            {/* LOAN STATISTICS */}
            {loanStats && (
              <div className="pt-6 border-t border-black/10">
                <h3 className="text-sm font-semibold mb-4">Loan Statistics</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-black/5 rounded-2xl py-4">
                    <p className="text-lg font-semibold">{loanStats.total}</p>
                    <p className="text-xs text-black/50 mt-1">Total Loans</p>
                  </div>

                  <div className="bg-black/5 rounded-2xl py-4">
                    <p className="text-lg font-semibold">
                      {loanStats.borrowed}
                    </p>
                    <p className="text-xs text-black/50 mt-1">Borrowed</p>
                  </div>

                  <div className="bg-black/5 rounded-2xl py-4">
                    <p className="text-lg font-semibold">
                      {loanStats.returned}
                    </p>
                    <p className="text-xs text-black/50 mt-1">Returned</p>
                  </div>

                  <div className="bg-black/5 rounded-2xl py-4">
                    <p className="text-lg font-semibold">{loanStats.late}</p>
                    <p className="text-xs text-black/50 mt-1">Late</p>
                  </div>

                  <div className="bg-black/5 rounded-2xl py-4">
                    <p className="text-lg font-semibold">{reviewsCount ?? 0}</p>
                    <p className="text-xs text-black/50 mt-1">Reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={() => setEditOpen(true)}
              className="w-full py-3 rounded-full bg-primary-300 text-white text-sm hover:opacity-90 transition"
            >
              Update Profile
            </button>
          </div>

          {/* EDIT PROFILE MODAL */}
          <EditProfileModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            initialName={profile.name}
            initialPhone={profile.phone}
          />
        </>
      )}
    </div>
  );
}
