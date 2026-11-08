import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';
import type { Note } from '../../types/note.ts';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNote,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['notes'],
            });
        },
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    return (
        <>
        <ul className={css.list}>
            {notes.map(({ id, title, content, tag }) => (
                <li className={css.listItem} key={id}>
                    <h2 className={css.title}>{title}</h2>
                    <p className={css.content}>{content}</p>

                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        <button
                            className={css.button}
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(id)}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>

        {deleteMutation.isError && (
            <p className={css.error}>
                Failed to delete note. Please try again.
            </p>
        )}
    </>
    );
}