import { getPool } from "../db/pool.ts";

export interface Review {
    id: number;
    bookId: number;
    author: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewRow {
    id: number;
    book_id: number;
    author: string;
    rating: number;
    comment: string;
    created_at: string;
}

function toReview(row: ReviewRow): Review {
    return {
        id: row.id,
        bookId: row.book_id,
        author: row.author,
        rating: row.rating,
        comment: row.comment,
        createdAt: row.created_at,
    };
}

// Existiert das Buch? (Basis für die 404-Fehler)
export async function bookExists(bookId: number): Promise<boolean> {
    const res = await getPool().query("SELECT 1 FROM books WHERE id = $1", [bookId]);
    return (res.rowCount ?? 0) > 0;
}

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    const res = await getPool().query(
        "SELECT id, book_id, author, rating, comment, created_at FROM reviews WHERE book_id = $1 ORDER BY id",
        [bookId]
    );
    return res.rows.map(toReview);
}

export async function createReview(
    bookId: number,
    author: string,
    rating: number,
    comment: string
): Promise<Review> {
    const res = await getPool().query(
        "INSERT INTO reviews (book_id, author, rating, comment) VALUES ($1, $2, $3, $4) " +
        "RETURNING id, book_id, author, rating, comment, created_at",
        [bookId, author, rating, comment]
    );
    return toReview(res.rows[0]);
}

// book_id mit prüfen: man soll nicht per reviewId Rezensionen
// eines anderen Buchs löschen können
export async function deleteReview(bookId: number, reviewId: number): Promise<boolean> {
    const res = await getPool().query(
        "DELETE FROM reviews WHERE book_id = $1 AND id = $2",
        [bookId, reviewId]
    );
    return (res.rowCount ?? 0) > 0;
}

// Durchschnitts-Rating (1 Nachkommastelle), null ohne Rezensionen
export async function getAverageRating(bookId: number): Promise<number | null> {
    const res = await getPool().query(
        "SELECT ROUND(AVG(rating), 1) AS average_rating FROM reviews WHERE book_id = $1",
        [bookId]
    );
    return res.rows[0]?.average_rating ?? null;
}

// Für die Buch-Liste: ein einziges SQL für alle Bücher
export async function getAverageRatings(bookIds: number[]): Promise<Map<number, number>> {
    const map = new Map<number, number>();
    if (bookIds.length === 0) return map;

    const res = await getPool().query(
        "SELECT book_id, ROUND(AVG(rating), 1) AS average_rating " +
        "FROM reviews WHERE book_id = ANY($1) GROUP BY book_id",
        [bookIds]
    );
    for (const row of res.rows) {
        map.set(row.book_id, row.average_rating);
    }
    return map;
}
