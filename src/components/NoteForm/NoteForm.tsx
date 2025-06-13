import css from "./NoteForm.module.css";
import {
  Formik,
  Field,
  Form,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { type NoteTag } from "../../types/note.ts";
import { type NewNoteContent } from "../../services/noteService.ts";

interface NoteFormProps {
  onSubmit: (values: NewNoteContent) => void; // Обробник сабміту форми
  onCancel: () => void; // Обробник для кнопки Cancel
  isSubmitting: boolean; // Пропс для відключення кнопки при сабміті
}

// Схема валідації за допомогою Yup
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string<NoteTag>() // Вказуємо, що це тип NoteTag
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag selected"
    )
    .required("Tag is required"),
});

const initialValues: NewNoteContent = {
  title: "",
  body: "",
  tag: "Personal", // Початкове значення за замовчуванням
};

export default function NoteForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Викликаємо зовнішній обробник onSubmit
        onSubmit(values);
        // Formik автоматично встановлює isSubmitting в false після завершення onSubmit
        // Можна скинути форму, якщо потрібно
        resetForm(); // Скидаємо форму після успішного сабміту
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            {/* FormikErrorMessage відображає помилку, якщо поле торкнулися і є помилка */}
            <FormikErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field
              as="textarea"
              id="body"
              name="body"
              rows={8}
              className={css.textarea}
            />
            <FormikErrorMessage
              name="body"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting} // Вимикаємо кнопку під час сабміту
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
