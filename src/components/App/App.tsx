
import { useState } from 'react';
import type { ComponentType } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './App.module.css'
import { fetchNotes } from '../../services/noteService.ts';
import NoteList from '../NoteList/NoteList.tsx';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

function App() {
    const [query,] = useState<string>("example");
    const [page, setPage] = useState(1);

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
                {data?.notes && data.total_pages > 1 &&
                    <ReactPaginate
                        pageCount={data.total_pages}
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={1}
                        onPageChange={({ selected }) => setPage(selected + 1)}
                        forcePage={page  - 1}
                        containerClassName={css.pagination}
                        activeClassName={css.active}
                        nextLabel="→"
                        previousLabel="←"
                    />
                }
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
        </div>
    );
}

export default App;
