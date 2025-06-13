import axios from "axios";
import { type Note } from "../types/note";
import type { NoteTag } from "../types/note";

export interface NewNoteContent {
  title: string;
  body: string;
  tag: NoteTag;
}

export interface PaginatedNotesResponse {
  results: Note[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface DeletedNoteInfo {
  message: string;
  deletedNoteId: string;
}

const BASE_URL = "https://notehub-public.goit.study/api";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<PaginatedNotesResponse> => {
  try {
    const response = await axiosConfig.get<PaginatedNotesResponse>("/notes", {
      params: {
        page,
        search,
        perPage,
      },
    });
    console.log(
      `Fetched notes (page - ${page}, perPage - ${perPage}), search - "${search}"):`,
      response.data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching notes:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching notes:", error);
    }
    throw error;
  }
};

export const createNote = async (content: NewNoteContent): Promise<Note> => {
  try {
    const response = await axiosConfig.post<Note>("/notes", content);
    console.log("Note created:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating note:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error creating note:", error);
    }
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<DeletedNoteInfo> => {
  try {
    const response = await axiosConfig.delete<DeletedNoteInfo>(`/notes/${id}`);
    console.log(`Note with ID ${id} deleted:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting note with ID ${id}:`, error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error deleting note:", error);
    }
    throw error;
  }
};
