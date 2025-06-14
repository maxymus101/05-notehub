import css from "./NoteList.module.css";
import { type Note } from "../../types/note.ts";

interface NotesListProps {
  notes: Note[];
  // onSelectNote?: (note: Note) => void; // Якщо ви хочете відкривати модалку для нотаток
  onDeleteNote?: (id: number) => void; // Якщо ви хочете додати функцію видалення
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
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => onDeleteNote?.(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
