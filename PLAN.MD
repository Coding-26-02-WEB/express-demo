# Reviews und Durchschnitt

## Ziel

Rezensionen liegen in einer neuen Tabelle `reviews`. Eine Abfrage bildet `AVG(reviews.rating)` pro Buch. Bücher ohne Rezension bleiben im Ergebnis, ihr Durchschnitt ist `NULL`.

## Abgrenzung

Die Tabelle `books` besteht bereits und wird nicht angefasst: kein `DROP`, kein `CREATE`, kein `ALTER`, kein `INSERT`, kein `UPDATE`, kein `DELETE` und kein `setval` auf `books`.

Das SQL für `reviews` liegt in `db/schema.sql`. Die API liest und schreibt nur `reviews`. Der Durchschnitt in den Buch-Antworten kommt aus `AVG(rating)` über `reviews`, gruppiert nach `book_id`. Bücher ohne Rezension bekommen `averageRating: null`. Die Verbindung läuft über `DATABASE_URL`. Die Zugangsdaten selbst sind noch nicht hinterlegt.

## Tabelle reviews

`reviews` enthält nur die genannten Spalten. Kein `created_at`. `book_id` verweist auf die bestehende Spalte `books(id)`.

```sql
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id integer NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    author text NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text NOT NULL
);
```

`ON DELETE CASCADE` entfernt die Rezensionen eines Buchs, wenn dieses Buch gelöscht wird. Das löscht keine Zeile in `books`. `CHECK (rating BETWEEN 1 AND 5)` lehnt Bewertungen außerhalb von 1 bis 5 ab.

## Seed

Nur `reviews` wird befüllt. Die Identity-Spalte vergibt die Rezensions-IDs. Die Werte 1, 2 und 3 müssen in `books.id` schon existieren, sonst weist der Fremdschlüssel die Zeilen ab und `books` bleibt unverändert. Buch 10 und alle übrigen Bücher bekommen keine Rezension, damit ihr Durchschnitt `NULL` ist.

```sql
INSERT INTO reviews (book_id, author, rating, comment)
VALUES
    (1, 'Ada', 5, 'Ein Klassiker zum Wiederlesen.'),
    (1, 'Ben', 4, 'Schön, das Ende ist mir zu glatt.'),
    (2, 'Ada', 5, 'Dichte Welt, klarer Ton.'),
    (3, 'Chi', 3, 'Breit angelegt, zäh im Mittelteil.'),
    (3, 'Ben', 5, 'Die Figuren tragen das Buch.');
```

## Durchschnitt

Die Abfrage liest `books` und schreibt nichts dorthin. `LEFT JOIN` plus `GROUP BY b.id` behält jedes bestehende Buch. `AVG(r.rating)` über keine Rezension ist in PostgreSQL `NULL`. Kein `COALESCE` auf 0.

```sql
SELECT b.id,
       AVG(r.rating) AS average_rating
FROM books AS b
LEFT JOIN reviews AS r ON r.book_id = b.id
GROUP BY b.id
ORDER BY b.id;
```

`AVG` liefert `numeric`, zum Beispiel `4.5000000000000000` für Buch 1 (Bewertungen 5 und 4) und `NULL` für ein Buch ohne Rezension. Runden bleibt der späteren API überlassen.

Eine Abfrage nur auf `reviews` mit `GROUP BY book_id` würde Bücher ohne Rezension weglassen. Der `LEFT JOIN` bleibt deshalb die gewählte Form. Er ändert `books` nicht.

## Nächste Schritte

- `DATABASE_URL` setzen und `db/schema.sql` gegen die bestehende Datenbank ausführen. `books` bleibt unverändert. Die Buch-IDs 1, 2 und 3 müssen dort schon existieren, sonst weist der Fremdschlüssel den Seed ab.
- Die Commits liegen auf `gruppe-2`.
