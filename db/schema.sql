-- ============================================================
-- express-demo — Bücher + Rezensionen (Gruppenübung)
-- books:  10 Bücher (gleiche IDs wie im Demo)
-- reviews: 1:n zu books, FK mit ON DELETE CASCADE,
--          CHECK (rating BETWEEN 1 AND 5)
-- ============================================================

CREATE TABLE IF NOT EXISTS books (
    id     SERIAL PRIMARY KEY,
    title  TEXT NOT NULL,
    author TEXT NOT NULL
);

INSERT INTO books (id, title, author) VALUES
    (1,  'The Hobbit',                           'J.R.R. Tolkien'),
    (2,  'Dune',                                 'Frank Herbert'),
    (3,  'A Game of Thrones',                    'George R.R. Martin'),
    (4,  'Foundation',                           'Isaac Asimov'),
    (5,  'The Name of the Wind',                 'Patrick Rothfuss'),
    (6,  'Neuromancer',                          'William Gibson'),
    (7,  'Die unendliche Geschichte',            'Michael Ende'),
    (8,  'The Left Hand of Darkness',            'Ursula K. Le Guin'),
    (9,  'Mistborn: The Final Empire',           'Brandon Sanderson'),
    (10, 'The Hitchhiker''s Guide to the Galaxy','Douglas Adams')
ON CONFLICT (id) DO NOTHING;

-- SERIAL-Fortsetzung korrigieren, damit neue Bücher ID 11+ bekommen
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    book_id    INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author     TEXT NOT NULL,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO reviews (book_id, author, rating, comment) VALUES
    (1, 'Anna',  5, 'Bester Fantasy-Roman, den ich je gelesen habe.'),
    (1, 'Ben',   4, 'Sehr gut, ein bisschen lang im Mittelteil.'),
    (2, 'Clara', 5, 'Das Universum und die Spice-Zeit: großartig.'),
    (3, 'David', 3, 'Viele Figuren, aber die Intrigen sind stark.'),
    (7, 'Emma',  5, 'Mein Lieblingsbuch seit der Grundschule.')
ON CONFLICT DO NOTHING;
