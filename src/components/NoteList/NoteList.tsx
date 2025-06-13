import css from "./NoteList.module.css";
import { type Note } from "../../types/note.ts";

interface NotesListProps {
  notes: Note[];
  // onSelectNote?: (note: Note) => void; // Якщо ви хочете відкривати модалку для нотаток
  onDeleteNote?: (id: string) => void; // Якщо ви хочете додати функцію видалення
}

export default function NoteList({ notes, onDeleteNote }: NotesListProps) {
  // Відображаємо повідомлення, якщо нотаток немає.
  // Це дозволяє NotesList бути самодостатнім у відображенні цього стану.
  if (notes.length === 0) {
    return <p className={css.noNotesMessage}>No notes found.</p>;
  }
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note._id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.body}</p>
          <div className={css.footer}>
            {/* Додаємо заглушку для тегу, оскільки Note інтерфейс його не має */}
            <span className={css.tag}>General</span>
            <button
              className={css.button}
              // При кліку викликаємо функцію onDeleteNote, передаючи ID нотатки
              onClick={() => onDeleteNote?.(note._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
