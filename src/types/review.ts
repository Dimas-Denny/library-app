import type { Book } from "./books";

/* Review untuk Book Detail (/reviews/book/:id) */
export type BookReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;

  user: {
    id: number;
    name: string;
  };
};

/* Review untuk My Reviews (/me/reviews) */
export type MyReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book: Book;
};
