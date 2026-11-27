export interface Review {
    id: number;
    book_id: number;
    author: string;
    rating: number; // 1 bis 5
    comment: string;
}

export type NewReview = Omit<Review, "id" | "book_id">;
