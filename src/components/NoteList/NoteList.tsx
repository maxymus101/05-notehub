import css from "./NoteList.module.css";
import { type Note } from "../../types/note.ts";

interface NotesListProps {
  notes: Note[];
  onDeleteNote?: (id: number) => void; // Функція видалення
}

export default function NoteList({ notes, onDeleteNote }: NotesListProps) {
  // Відображаємо повідомлення, якщо нотаток немає.
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
