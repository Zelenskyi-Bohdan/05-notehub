import axios from 'axios';
import type Note from '../types/note.ts';

interface NoteResponse {
    page: number;
    notes: Note[];
    total_pages: number;
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
        perPage: 10
        },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  }
    }
  );

  return response.data;
};