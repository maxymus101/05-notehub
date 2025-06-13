export interface Note {
  _id: string; // Унікальний ідентифікатор нотатки (зверніть увагу на _id у MongoDB)
  title: string; // Заголовок нотатки
  content: string; // Текст нотатки
  createdAt: string; // Дата створення (формат ISO 8601)
  updatedAt: string; // Дата останнього оновлення (формат ISO 8601)
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
