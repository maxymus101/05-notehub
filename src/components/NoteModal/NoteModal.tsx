import React, { useEffect, type MouseEvent } from "react";
import ReactDOM from "react-dom";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function NoteModal({
  isOpen,
  onClose,
  children,
}: NoteModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
