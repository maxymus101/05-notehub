import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "An unexpected error occurred.",
}: ErrorMessageProps) {
  return (
    <div className={css.errorContainer}>
      <p className={css.errorMessage}>⚠️ Error: {message}</p>
    </div>
  );
}
