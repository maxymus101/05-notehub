export interface Note {
  id: number;
  title: string; // Заголовок нотатки
  content: string; // Текст нотатки
  createdAt: string; // Дата створення (формат ISO 8601)
  updatedAt: string; // Дата останнього оновлення (формат ISO 8601)
  tag: NoteTag;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
