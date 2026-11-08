
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService.ts';
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

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['notes', query, page],
        queryFn: () => fetchNotes(query, page),
        placeholderData: keepPreviousData,
    });

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
                        setIsModalOpen(true);
                    }}
                >Create note +</button>

                {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
            </header>

            {isLoading && <p>Loading...</p>}

            {isError && <p>Something went wrong!</p>}

            {isSuccess && data.notes.length > 0 && (
                <NoteList
                    notes={data.notes}
                />
            )}

            {isSuccess && data.notes.length === 0 && (
                <p>No notes found.</p>
            )}
        </div>
    );
}

export default App;
