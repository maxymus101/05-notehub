import css from "./App.module.css";
import NoteList from "../NoteList/NoteList.tsx";
import NoteModal from "../NoteModal/NoteModal.tsx";
import SearchBox from "../SearchBox/SearchBox.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";

import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import {
  type PaginatedNotesResponse,
  type NewNoteContent,
  createNote,
  deleteNote,
} from "../../services/noteService.ts";
import {
  fetchNotes,
  type DeletedNoteInfo,
} from "../../services/noteService.ts";
import { type Note } from "../../types/note.ts";

import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

export default function App() {
  const queryClient = useQueryClient(); // Ініціалізуємо queryClient для інвалідації кешу
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(currentSearchQuery, 500); // Затримка 500ms
  const [currentPage, setCurrentPage] = useState(1);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false); // Стан для керування модалкою створення нотатки
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // === useQuery для отримання нотаток ===
  const {
    data,
    error: queryError,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<PaginatedNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearchQuery),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  // === useMutation для створення нової нотатки ===
  const createNoteMutation = useMutation<Note, Error, NewNoteContent>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
      setIsNoteModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error creating note: ${error.message}`);
    },
  });

  // === useMutation для видалення нотатки ===
  const deleteNoteMutation = useMutation<DeletedNoteInfo, Error, string>({
    // Типи: успішна відповідь, помилка, ID нотатки
    mutationFn: deleteNote, // Функція з noteService, яка виконує DELETE-запит
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Інвалідуємо кеш після видалення
      toast.success("Note deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Error deleting note: ${error.message}`);
    },
  });

  const notifyNoNotesFound = () =>
    toast.error("No notes found for your request.", {
      style: { background: "rgba(125, 183, 255, 0.8)" },
      icon: "ℹ️",
    });

  // useEffect для відображення сповіщення про відсутність нотаток
  useEffect(() => {
    if (isSuccess && currentSearchQuery && (data?.notes || []).length === 0) {
      notifyNoNotesFound();
    }
  }, [isSuccess, data, currentSearchQuery]);

  // Обробник пошуку:
  const handleSearch = (newQuery: string) => {
    setCurrentSearchQuery(newQuery);
    setCurrentPage(1);
  };

  // Обробник зміни сторінки для ReactPaginate:
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Прокрутка до верху сторінки
  };

  //* Обробник видалення нотатки
  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  // Обробник сабміту форми створення нотатки
  const handleCreateNoteSubmit = (values: NewNoteContent) => {
    createNoteMutation.mutate(values);
  };

  // Обробник для кнопки "Create note +"
  const openCreateNoteModal = () => setIsNoteModalOpen(true);
  const closeCreateNoteModal = () => setIsNoteModalOpen(false);

  const handleCloseErrorMessage = () => {
    // setErrorMessage(null); // Просто скидаємо стан помилки
    // Також скидаємо стани помилок мутацій, якщо вони активні
    queryClient.resetQueries({ queryKey: ["notes"], exact: false }); // Можливо, інвалідувати або скинути конкретні запити, якщо помилка пов'язана з ними
    createNoteMutation.reset(); // Скидає стан мутації
    deleteNoteMutation.reset(); // Скидає стан мутації
  };

  // Локальні змінні для рендерингу, обчислюються на кожному рендері.
  const notesToDisplay: Note[] = data?.notes || [];
  const totalPagesToDisplay: number = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch} />
          {notesToDisplay.length > 0 && totalPagesToDisplay > 1 && (
            <ReactPaginate
              pageCount={totalPagesToDisplay}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageClick}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <button
            className={css.createNoteButton}
            onClick={openCreateNoteModal}
          >
            Create note +
          </button>
        </header>

        {/* Показ лоадерів та помилок. Враховуємо лоадери як для запитів (isLoading, isFetching), так і для мутацій (isPending) */}
        {(isLoading ||
          isFetching ||
          createNoteMutation.isPending ||
          deleteNoteMutation.isPending) && <Loader />}
        {(isError ||
          createNoteMutation.isError ||
          deleteNoteMutation.isError) && (
          <ErrorMessage
            message={
              queryError?.message ||
              createNoteMutation.error?.message ||
              deleteNoteMutation.error?.message ||
              "An unknown error occurred"
            }
            onClose={handleCloseErrorMessage}
          />
        )}
        {notesToDisplay.length > 0 && (
          <NoteList notes={notesToDisplay} onDeleteNote={handleDeleteNote} />
        )}

        {/* Повідомлення про початковий стан або відсутність результатів */}
        {!isLoading &&
          !isFetching &&
          !isError &&
          notesToDisplay.length === 0 &&
          !currentSearchQuery && (
            <p className={css.initialMessage}>
              Start by searching for notes or create a new one!
            </p>
          )}
        {!isLoading &&
          !isFetching &&
          !isError &&
          notesToDisplay.length === 0 &&
          currentSearchQuery && (
            <p className={css.noResultsMessage}>
              No notes found for "{currentSearchQuery}".
            </p>
          )}
        <Toaster />
        <NoteModal isOpen={isNoteModalOpen} onClose={closeCreateNoteModal}>
          <NoteForm
            onSubmit={handleCreateNoteSubmit}
            onCancel={closeCreateNoteModal}
            isSubmitting={createNoteMutation.isPending}
          />
        </NoteModal>
      </div>
    </>
  );
}
