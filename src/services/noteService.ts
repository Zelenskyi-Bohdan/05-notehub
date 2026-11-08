import axios from 'axios';
import type { Note, NoteTag } from '../types/note.ts';

interface NoteResponse {
    page: number;
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteData {
    title: string;
    content: string;
    tag: NoteTag;
}

export const fetchNotes = async (
  request: string,
  page: number
): Promise<NoteResponse> => {
  const response = await axios.get<NoteResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        search: request,
        page,
        perPage: 12
        },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  }
    }
  );

  return response.data;
};

export const createNote = async (
    note: CreateNoteData
): Promise<Note> => {
    const response = await axios.post<Note>(
        'https://notehub-public.goit.study/api/notes',
        note,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
            },
        }
    );

    return response.data;
};

export const deleteNote = async (
    id: string
): Promise<Note> => {
    const response = await axios.delete<Note>(
        `https://notehub-public.goit.study/api/notes/${id}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
            },
        }
    );

    return response.data;
};