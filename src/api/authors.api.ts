const BASE_URL = "https://library-backend-production-b9cf.up.railway.app/api";

export type Author = {
  id: number;
  name: string;
  bookCount: number;
};

export type GetPopularAuthorsResponse = {
  success: boolean;
  message: string;
  data: {
    authors: Author[];
  };
};

export async function getPopularAuthors(): Promise<GetPopularAuthorsResponse> {
  const res = await fetch(`${BASE_URL}/authors/popular?limit=4`);

  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }

  return res.json();
}

export async function getAuthorById(id: number) {
  const res = await fetch(`${BASE_URL}/authors/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch author");
  }

  return res.json();
}
