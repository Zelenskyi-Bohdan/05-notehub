
import { useState } from 'react';
import { useQuery, useMutation, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css'
import { fetchNotes, createNote, deleteNote } from '../../services/noteService.ts';
import type { CreateNoteData } from '../../services/noteService.ts';
import NoteList from '../NoteList/NoteList.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';
import NoteForm from '../NoteForm/NoteForm.tsx';
import Modal from '../Modal/Modal.tsx';


function App() {
    const [query, setQuery] = useState<string>("");
    const [page, setPage] = useState(1);
    const [text, setText] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['notes', query, page],
        queryFn: () => fetchNotes(query, page),
        placeholderData: keepPreviousData,
    });

    const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess: async () => {
            setPage(1);
            setIsModalOpen(false);

            await queryClient.invalidateQueries({
                queryKey: ['notes']
            });
        },
    });

    const handleCreateNote = async (values: CreateNoteData) => {
    try {
        await createMutation.mutateAsync(values);
    } catch {
        // 
    }
    };

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['notes']
            });
        },
    });

    const handleDeleteNote = (id: string) => {
        deleteMutation.reset();
        deleteMutation.mutate(id);
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setQuery(value);
        setPage(1);
    }, 300);

    const handleSearchChange = (value: string) => {
        setText(value);
        debouncedSearch(value);
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={text} onChange={handleSearchChange}/>
                {data?.notes && data.totalPages > 1 &&
                    <Pagination
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                        currentPage={page}
                />
                }
                <button
                    className={css.button}
                    onClick={() => {
                        createMutation.reset();
                        setIsModalOpen(true);
                    }}
                >Create note +</button>

                {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onSubmit={handleCreateNote}
                        onCancel={() => setIsModalOpen(false)}
                    />

                    {createMutation.isError && (
                        <p className={css.error}>
                            Failed to create note. Please try again.
                        </p>
                    )}
                </Modal>
            )}
            </header>

            {isLoading && <p>Loading...</p>}

            {isError && <p>Something went wrong!</p>}

            {isSuccess && data.notes.length > 0 && (
                <NoteList
                    notes={data.notes}
                    onDelete={handleDeleteNote}
                    isDeleting={deleteMutation.isPending}
                />
            )}
            
            {deleteMutation.isError && (
                <p className={css.error}>
                    Failed to delete note. Please try again.
                </p>
            )}

            {isSuccess && data.notes.length === 0 && (
                <p>No notes found.</p>
            )}
        </div>
    );
}

export default App;
