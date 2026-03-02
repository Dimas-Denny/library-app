import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/users.api";

type Props = {
  open: boolean;
  onClose: () => void;
  initialName: string;
  initialPhone?: string | null;
};

export default function EditProfileModal({
  open,
  onClose,
  initialName,
  initialPhone,
}: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = React.useState(initialName);
  const [phone, setPhone] = React.useState(initialPhone ?? "");

  React.useEffect(() => {
    setName(initialName);
    setPhone(initialPhone ?? "");
  }, [initialName, initialPhone]);

  const mutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      console.log("SUCCESS UPDATE");
    },

    onError: (err) => {
      console.log("ERROR UPDATE:", err);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await mutation.mutateAsync({ name, phone });

      // Refresh profile
      await queryClient.invalidateQueries({ queryKey: ["my-profile"] });

      // Close modal
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
        <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-black/60 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 rounded-xl border border-black/15 px-4 text-sm outline-none focus:border-black/30"
            />
          </div>

          <div>
            <label className="block text-sm text-black/60 mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 rounded-xl border border-black/15 px-4 text-sm outline-none focus:border-black/30"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-sm border border-black/15 hover:bg-black/5 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className={`px-6 py-2 rounded-full text-sm text-white transition ${
                mutation.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-300 hover:opacity-90"
              }`}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
