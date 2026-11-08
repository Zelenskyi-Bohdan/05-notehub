
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService.ts'; // createNote   deleteNote
import NoteList from '../NoteList/NoteList.tsx';
import Pagination from '../Pagination/Pagination.tsx';


function App() {
    const [query,] = useState<string>("");
    const [page, setPage] = useState(1);

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['notes', query, page],
        queryFn: () => fetchNotes(query!, page),
        enabled: query !== null,
        placeholderData: keepPreviousData,
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                {/* Компонент SearchBox */}
                {data?.notes && data.totalPages > 1 &&
                    <Pagination
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                        currentPage={page}
                />
                }
                <button className={css.button}>Create note +</button>
            </header>

            {isLoading && <p>Loading...</p>}

            {isError && <p>Something went wrong!</p>}

            {isSuccess && data.notes.length > 0 && (
                <NoteList notes={data.notes} />
            )}

            {isSuccess && data.notes.length === 0 && (
                <p>No notes found.</p>
            )}
        </div>
    );
}

export default App;
