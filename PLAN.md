# Plan: Filme aus der Datenbank an den Server anbinden

## Ausgangslage

- **DB:** `db/schema.sql` hat bereits `movies` (die Crew steht direkt als Spalten in der Tabelle), `genres` und die n:m-Tabelle `movie_genres`, mit 10 Filmen und 9 Genres als Testdaten.
- **Server:** `src/movies/movies.service.ts` liest noch aus einem fest eingetragenen Array. Es gibt keine `movies.repo.ts`.
- **Vorlage:** Bei den Books ist die Aufteilung Router → Controller → Service → Repo schon fertig (`src/books/books.repo.ts`). Movies wird nach demselben Muster gebaut.
- **Wichtigster Unterschied zu Books:** Die API gibt einen Film so zurück: `{ id, title, year, crew: {director, editor, cinematographer}, genres: string[] }`. In der DB liegt er aber flach in einer Zeile, und die Genres kommen über einen JOIN. Das Repo muss die Daten also in diese Form umbauen.

---

## 1. Feature-Details

### 1.1 Pflicht: die bestehenden Endpunkte auf die DB umstellen

| Endpunkt | Verhalten | Status-Codes |
|---|---|---|
| `GET /movies` | Alle Filme, sortiert nach `id` | 200 |
| `GET /movies/:id` | Ein Film | 200, **400** bei ungültiger ID, 404 wenn nicht gefunden |

**Die Antwort bleibt genau wie heute**, damit kein Client kaputtgeht:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "The Godfather",
    "year": 1972,
    "crew": { "director": "Francis Ford Coppola", "editor": "William Reynolds", "cinematographer": "Gordon Willis" },
    "genres": ["Crime", "Drama"]
  }
}
```

**Regeln:**

- Ein Film ohne Genre bekommt `genres: []`, nicht `[null]` (deshalb `LEFT JOIN` und `FILTER`, siehe unten).
- Die Genres werden alphabetisch sortiert, damit die Reihenfolge immer gleich ist. Bisher war sie zufällig vom Array vorgegeben, z.B. „Crime, Drama“. Das ist die einzige sichtbare Änderung.
- **ID prüfen:** `/movies/abc` gibt heute `Number("abc")` = `NaN` an Postgres weiter, und das endet in einem **500**. Neu: Ist die ID keine positive ganze Zahl, wird `InvalidMovieIdError` geworfen und der Server antwortet mit **400**.

**SQL für die Umwandlung** (die gleiche Basis-Abfrage für alle und für einen Film):

```sql
SELECT
    m.id, m.title, m.year,
    json_build_object(
        'director', m.director,
        'editor', m.editor,
        'cinematographer', m.cinematographer
    ) AS crew,
    COALESCE(
        array_agg(g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL),
        '{}'
    ) AS genres
FROM movies m
LEFT JOIN movie_genres mg ON mg.movie_id = m.id
LEFT JOIN genres g        ON g.id = mg.genre_id
-- WHERE m.id = $1   (nur bei getMovieById)
GROUP BY m.id
ORDER BY m.id;
```

`pg` wandelt `json` automatisch in ein Objekt und `varchar[]` in `string[]` um. Im TypeScript-Code muss man also nichts mehr umbauen. (Alternativ könnte man flache Zeilen holen und in TS mit `reduce` zusammenbauen. Das wäre mehr Code und fehleranfälliger, deshalb nicht empfohlen.)

### 1.2 Optional (eigener Branch, erst nach dem Pflichtteil)

| Endpunkt | Verhalten |
|---|---|
| `GET /movies/search?query=...` | `ILIKE` auf `title` und `director`. Fehlt `query`, gibt es 400 (`MovieSearchQueryMissingError`), wie bei Books |
| `GET /movies?genre=Drama` | Nur Filme mit diesem Genre. Dabei sollen **trotzdem alle Genres** des Films in der Antwort stehen. Deshalb mit `WHERE m.id IN (SELECT movie_id ... WHERE g.name ILIKE $1)` filtern und nicht direkt auf den JOIN |
| `GET /genres` | Liste aller Genres (falls ein Frontend Filter-Buttons braucht) |

Wichtig: `/search` muss im Router **vor** `/:id` stehen, sonst wird „search“ als ID gelesen.

---

## 2. Schritt für Schritt

**Schritt 0: Vorbereitung**

1. Noch nicht committete Änderungen auf `main` zuerst committen (eigener Branch/PR) oder stashen, damit sie nicht im Movies-Branch landen.
2. Die DB starten: `docker compose up -d`.
3. Prüfen, ob die Movie-Tabellen schon in der DB sind. `docker-compose.yaml` führt `schema.sql` **nicht** automatisch aus. Die ganze Datei noch einmal auszuführen schlägt bei `CREATE TABLE books` fehl, also nur den Movies-Teil per `psql` oder im DB-Client ausführen.
4. Das SQL von oben einmal direkt in der DB testen, bevor es in den Code kommt.

**Schritt 1: Typen auslagern.** Neue Datei `src/movies/movies.types.ts` mit `Crew` und `Movie`, beide **exportiert**. Repo und Service importieren von dort. (Bei Books importiert das Repo den Typ aus dem Service, das ist eine unschöne Abhängigkeit, die wir hier nicht übernehmen.)

**Schritt 2: Repo.** Neue Datei `src/movies/movies.repo.ts`:

- `getAllMovies(): Promise<Movie[]>`
- `getMovieById(id: number): Promise<Movie | null>`
- Die Basis-Abfrage einmal als Konstante `MOVIE_SELECT` anlegen und für beide Funktionen nutzen, damit sie nicht doppelt im Code steht.
- `null` zurückgeben, wenn nichts gefunden wird. Fehler werden nicht im Repo geworfen.

**Schritt 3: Service.** In `src/movies/movies.service.ts` das fest eingetragene Array löschen und die Repo-Funktionen aufrufen (mit Alias-Import wie bei Books). Ist das Ergebnis `null`, `MovieNotFoundError` werfen.

**Schritt 4: ID-Prüfung.** `InvalidMovieIdError` in `src/movies/movies.errors.ts` anlegen und dort auf 400 mappen. Im Controller vor dem Service-Aufruf prüfen: `Number.isInteger(id) && id > 0`.

**Schritt 5: Swagger.** In `src/movies/movies.router.ts` die 400-Antwort bei `/movies/{id}` ergänzen.

**Schritt 6: Manuell testen** (siehe Abschnitt 5), dann `npm run typecheck`.

**Schritt 7: PR**, Review, Merge. Danach eventuell die optionalen Features aus 1.2.

---

## 3. Git-Strategie

- **Branch:** `feature/movies-db` von einem aktuellen `main` abzweigen:
  ```bash
  git switch main && git pull && git switch -c feature/movies-db
  ```
  Die optionalen Features kommen später in eigene Branches, z.B. `feature/movies-search`.
- **Kleine Commits, ein Commit pro Schicht.** Kurz, auf Englisch, im Imperativ und kleingeschrieben, so wie die bisherigen Commits („implement books repository“):
  1. `extract movie types`
  2. `implement movies repository`
  3. `use repository in movies service`
  4. `validate movie id`
  5. `update movies swagger docs`
- **Nach jedem Commit läuft der Server noch und der Typecheck ist grün.** Keine Commits, die das Projekt kaputt hinterlassen.
- **PR nach `main`.** In die Beschreibung gehören: was sich geändert hat, die eine sichtbare Änderung (Genre-Reihenfolge), wie man testet (curl-Befehle) und der Hinweis, dass die DB das Schema braucht.
- **Mergen** erst nach Review. Danach den Branch löschen.
- **Niemals committen:** `.env` (Zugangsdaten zur DB). In `.gitignore` prüfen, ob die Datei ausgeschlossen ist.

---

## 4. Code-Konventionen

- **Schichten:** Router (Routen und Swagger) → Controller (`req`/`res` lesen, Eingaben prüfen, `sendSuccess`, `next(error)`) → Service (Fachlogik, Fehler werfen) → Repo (nur SQL, gibt Daten oder `null` zurück).
- **Dateinamen:** `<feature>.<schicht>.ts`, also `movies.repo.ts`, `movies.types.ts`.
- **Imports mit der Endung `.ts`**, z.B. `"./movies.repo.ts"` (ESM mit tsx). Hinweis: `books.repo.ts` importiert ohne Endung, das ist uneinheitlich und sollte nicht kopiert werden.
- **Funktionsnamen:** Handler heißen `get<X>Handler`, Service und Repo `getAll<X>` / `get<X>ById`. Gleiche Namen im Service und im Repo werden beim Import mit `as ...Repo` umbenannt.
- **SQL:** Werte immer als Parameter (`$1`), nie mit Template-Strings in die Abfrage einbauen (Schutz gegen SQL-Injection). Keine `SELECT *`, wenn die Daten umgebaut werden. Schlüsselwörter in Großbuchstaben, Aliasse `m`, `g`, `mg`.
- **DB-Zugriff:** nur über `getPostgresPool()` und nie einen eigenen Pool anlegen.
- **Fehler:** eigene Klassen in `movies.errors.ts`, die von `Error` erben, mit englischer Meldung. Das HTTP-Mapping passiert nur in `handleMovieErrors`. Unbekannte Fehler gehen mit `next(err)` weiter an den globalen 500-Handler.
- **Antworten:** Erfolg immer über `sendSuccess` (`{ success, data }`), Fehler als `{ error: message }`.
- **Sprachen:** Code und Fehlermeldungen auf Englisch, Swagger-Texte und Kommentare auf Deutsch.
- **Formatierung:** 4 Leerzeichen Einrückung, doppelte Anführungszeichen, Semikolons.

---

## 5. Abnahme-Checkliste

```bash
curl localhost:3000/movies              # 200, 10 Filme, jeder mit crew + genres[]
curl localhost:3000/movies/2            # 200, genres: ["Crime","Drama"]
curl localhost:3000/movies/999          # 404 "Movie not found. ID: 999"
curl localhost:3000/movies/abc          # 400 (statt bisher 500)
npm run typecheck                       # ohne Fehler
```

Zusätzlich:

- [ ] In der DB einen Film ohne Genre einfügen. Er muss mit `genres: []` zurückkommen.
- [ ] Unter `/docs` prüfen, dass Swagger richtig angezeigt wird.
