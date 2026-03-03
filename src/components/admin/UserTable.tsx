import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers, type PaginatedUsersResponse } from "@/api/users.api";

export default function UserTable() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const limit = 10;

  const { data, isLoading } = useQuery<PaginatedUsersResponse>({
    queryKey: ["admin-users", page, search],
    queryFn: () => getUsers(page, limit, search),
    placeholderData: (previousData) => previousData,
  });

  const users = data?.users ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  if (isLoading && !data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User</h2>

      <input
        placeholder="Search user"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="w-full md:w-96 border rounded-full px-4 py-2 text-sm"
      />

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-black/60">
              <tr>
                <th className="p-4 text-left">No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Created at</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{(page - 1) * limit + index + 1}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARD LIST ================= */}
        <div className="md:hidden space-y-4 p-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-black/5 space-y-3"
            >
              <div className="flex justify-between text-sm">
                <span className="text-black/50">No</span>
                <span className="font-medium">
                  {(page - 1) * limit + index + 1}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/50">Name</span>
                <span className="font-medium">{user.name}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/50">Email</span>
                <span>{user.email}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/50">Nomor Handphone</span>
                <span>{user.phone}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/50">Created at</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 text-sm text-black/60">
          <span>
            {total === 0 ? (
              "Showing 0 to 0 of 0 entries"
            ) : (
              <>
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} entries
              </>
            )}
          </span>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 text-sm disabled:opacity-40 hover:text-black"
            >
              ‹ <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-md text-sm transition ${
                      page === p
                        ? "border border-black/20 bg-white shadow-sm font-medium"
                        : "hover:bg-black/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              {totalPages > 3 && page < totalPages - 1 && (
                <span className="px-1 text-black/50">...</span>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 text-sm disabled:opacity-40 hover:text-black"
            >
              <span>Next</span> ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
