// Author Type

export type Author = {
  id: number;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
};

// Category Type

export type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// Book Type

export type Book = {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;

  coverImage: string;

  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;

  authorId: number;
  categoryId: number;

  createdAt: string;
  updatedAt: string;

  author: Author;
  category: Category;
};
