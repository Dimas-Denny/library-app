import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  getAdminBookById,
  updateBook,
  getAuthors,
  getCategories,
  type Author,
  type Category,
  type AdminBookDetailResponse,
} from "@/api/books.api";

export default function AdminBookEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /* ================= FETCH BOOK ================= */

  const { data: book, isLoading: loadingBook } =
    useQuery<AdminBookDetailResponse>({
      queryKey: ["admin-book-detail", id],
      queryFn: () => getAdminBookById(id as string),
      enabled: !!id,
    });

  /* ================= FETCH AUTHORS ================= */

  const { data: authors } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  /* ================= FETCH CATEGORIES ================= */

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  /* ================= FORM STATE ================= */

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [pages, setPages] = React.useState<number>(0);
  const [authorId, setAuthorId] = React.useState<number>(0);
  const [categoryId, setCategoryId] = React.useState<number>(0);

  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  /* ================= PREFILL FORM ================= */

  React.useEffect(() => {
    if (!book) return;

    setTitle(book.title);
    setDescription(book.description);
    setPages(book.pages);
    setAuthorId(book.author?.id ?? 0);
    setCategoryId(book.category?.id ?? 0);
    setCoverPreview(book.coverImage ?? null);
  }, [book]);

  /* ================= UPDATE MUTATION ================= */

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("pages", String(pages));
      formData.append("authorId", String(authorId));
      formData.append("categoryId", String(categoryId));

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      return updateBook(id as string, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-book-detail", id],
      });

      navigate(`/admin/books/${id}`);
    },

    onError: () => {
      alert("Failed to update book");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  /* ================= IMAGE ================= */

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  function removeImage() {
    setCoverPreview(null);
    setCoverFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /* ================= LOADING ================= */

  if (loadingBook || !authors || !categories) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="px-4 md:px-16 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* HEADER */}

        <Button
          variant="ghost"
          onClick={() =>
            navigate("/admin", {
              state: { activeTab: "BOOK" },
            })
          }
          className="flex items-center gap-2 text-black/60 mb-8"
        >
          <ArrowLeft size={16} />
          <span className="font-extrabold text-2xl">Edit Book</span>
        </Button>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}

          <div>
            <label className="text-sm font-medium">Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          {/* AUTHOR */}

          <div>
            <label className="text-sm font-medium">Author</label>

            <select
              value={authorId}
              onChange={(e) => setAuthorId(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="text-sm font-medium">Category</label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* PAGES */}

          <div>
            <label className="text-sm font-medium">Number of Pages</label>

            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm font-medium">Description</label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 resize-none"
            />
          </div>

          {/* COVER IMAGE */}

          <div>
            <label className="text-sm font-medium">Cover Image</label>

            <div className="mt-3 border-2 border-dashed border-black/10 rounded-2xl p-6 text-center space-y-4">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="cover"
                  className="w-32 mx-auto rounded shadow"
                />
              )}

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-black/5"
                >
                  <Upload size={16} />
                  Change Image
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50"
                >
                  <Trash size={16} />
                  Delete Image
                </button>
              </div>

              <p className="text-xs text-black/40">PNG or JPG (max. 5mb)</p>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpload}
              />
            </div>
          </div>

          {/* SAVE BUTTON */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium mt-4"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
