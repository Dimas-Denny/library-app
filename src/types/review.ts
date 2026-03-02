export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;

  user: {
    id: number;
    name: string;
  };
};
