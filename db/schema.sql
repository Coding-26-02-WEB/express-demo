-- Legt nur reviews an. books bleibt unverändert.

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id integer NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    author text NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text NOT NULL
);

-- book_id 1, 2 und 3 müssen in books.id schon existieren.
INSERT INTO reviews (book_id, author, rating, comment)
VALUES
    (1, 'Ada', 5, 'Ein Klassiker zum Wiederlesen.'),
    (1, 'Ben', 4, 'Schön, das Ende ist mir zu glatt.'),
    (2, 'Ada', 5, 'Dichte Welt, klarer Ton.'),
    (3, 'Chi', 3, 'Breit angelegt, zäh im Mittelteil.'),
    (3, 'Ben', 5, 'Die Figuren tragen das Buch.');

-- Liest books, schreibt nichts. Bücher ohne Rezension bleiben mit NULL.
SELECT b.id,
       AVG(r.rating) AS average_rating
FROM books AS b
LEFT JOIN reviews AS r ON r.book_id = b.id
GROUP BY b.id
ORDER BY b.id;
