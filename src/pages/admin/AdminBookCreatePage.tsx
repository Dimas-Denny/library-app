import React from "react";
import { ArrowLeft, Upload, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
  createBook,
  getAuthors,
  getCategories,
  type Author,
  type Category,
} from "@/api/books.api";

export default function AdminBookCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [isbn, setIsbn] = React.useState("");
  const [authorId, setAuthorId] = React.useState<number>(0);
  const [categoryId, setCategoryId] = React.useState<number>(0);
  const [pages, setPages] = React.useState("");
  const [totalCopies, setTotalCopies] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: authors } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-books"],
      });

      toast.success("Book added successfully");
      navigate("/admin");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("CREATE BOOK ERROR:", error);

      const message = error.response?.data?.message || "Failed to add book";

      toast.error(message);
    },
  });

  function validate() {
    if (!title) return false;
    if (!isbn) return false;
    if (!authorId) return false;
    if (!categoryId) return false;
    if (!pages) return false;
    if (!totalCopies) return false;
    if (!description) return false;

    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("isbn", isbn);
    formData.append("description", description);
    formData.append("pages", pages);
    formData.append("authorId", String(authorId));
    formData.append("categoryId", String(categoryId));
    formData.append("totalCopies", totalCopies);

    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    mutation.mutate(formData);
  }

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

  return (
    <div className="px-4 md:px-16 py-10 flex justify-center">
      <div className="w-full max-w-xl">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 mb-6 text-black/60"
        >
          <ArrowLeft size={18} />
          <span className="text-xl font-semibold">Add Book</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            >
              <option value="">Select Author</option>
              {authors?.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Pages</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Total Copies</label>
            <input
              type="number"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Cover Image</label>

            <div className="mt-3 border-2 border-dashed border-black/10 rounded-2xl p-6 text-center">
              {!coverPreview && (
                <>
                  <Upload className="mx-auto mb-3 text-black/40" />
                  <p
                    className="text-blue-600 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Click to upload
                  </p>
                </>
              )}

              {coverPreview && (
                <>
                  <img
                    src={coverPreview}
                    className="w-40 mx-auto mb-4 rounded shadow"
                  />

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
                    >
                      <Upload size={16} />
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm"
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpload}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
