import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
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

  /* ================= FETCH DATA ================= */

  const { data: book } = useQuery<AdminBookDetailResponse>({
    queryKey: ["admin-book-detail", id],
    queryFn: () => getAdminBookById(id as string),
    enabled: !!id,
  });

  const { data: authors } = useQuery<Author[]>({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

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

  React.useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description);
      setPages(book.pages);
      setAuthorId(book.author?.id ?? 0);
      setCategoryId(book.category?.id ?? 0);
    }
  }, [book]);

  /* ================= UPDATE ================= */

  const mutation = useMutation({
    mutationFn: () =>
      updateBook(id as string, {
        title,
        description,
        pages,
        authorId,
        categoryId,
      }),
    onSuccess: () => {
      navigate(`/admin/books/${id}`);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  if (!book || !authors || !categories)
    return <div className="p-10">Loading...</div>;

  return (
    <div className="px-4 md:px-16 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <button
          onClick={() => navigate("/admin", { state: { aciteveTab: "BOOK" } })}
          className="flex items-center gap-2 text-sm text-black/60 mb-8"
        >
          <ArrowLeft size={16} />
          <span className="font-extrabold text-2xl">Edit Book</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* AUTHOR */}
          <div>
            <label className="text-sm font-medium">Author</label>
            <select
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={authorId}
              onChange={(e) => setAuthorId(Number(e.target.value))}
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
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
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
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={5}
              className="w-full border border-black/10 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* COVER IMAGE BOX */}
          <div>
            <label className="text-sm font-medium">Cover Image</label>

            <div className="mt-3 border-2 border-dashed border-black/10 rounded-2xl p-6 text-center space-y-4">
              <img
                src={book.coverImage}
                alt="cover"
                className="w-32 mx-auto rounded shadow-sm"
              />

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-black/5"
                >
                  Change Image
                </button>

                <button
                  type="button"
                  className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50"
                >
                  Delete Image
                </button>
              </div>

              <p className="text-xs text-black/40">PNG or JPG (max. 5mb)</p>
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
