
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService.ts';
import NoteList from '../NoteList/NoteList.tsx';

function App() {
    const [query,] = useState<string>("example");
    const [page, ] = useState(1);

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['notes', query, page],
        queryFn: () => fetchNotes(query!, page),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    });

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                {/* Компонент SearchBox */}
                {/* Пагінація */}
                {/* Кнопка створення нотатки */}
            </header>

            {isLoading && <p>Loading...</p>}

            {isError && <p>Something went wrong!</p>}

            {isSuccess && data.notes.length > 0 && (
                <NoteList notes={data.notes} />
            )}

            {isSuccess && data.notes.length === 0 && (
                <p>No notes found.</p>
            )}

            {data?.notes && data?.notes.length !== 0 &&
                <NoteList notes={data.notes}/>}
        </div>
    );
}

export default App;
