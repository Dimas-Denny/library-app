type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Delete Data",
  description = "Once deleted, you won’t be able to recover this data.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div className="relative bg-white w-105 rounded-2xl shadow-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-sm text-black/50">{description}</p>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-pink-600 text-white text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
