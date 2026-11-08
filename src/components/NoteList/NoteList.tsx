import css from './NoteList.module.css';
import type { Note } from '../../types/note.ts';

interface NoteListProp {
    notes: Note[];
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export default function NoteList({ notes, onDelete, isDeleting }: NoteListProp) {
    return (
        <ul className={css.list}>
            {notes.map(({ id, title, content, tag }) => (
                <li className={css.listItem} key={id}>
                    <h2 className={css.title}>{title}</h2>
                    <p className={css.content}>{content}</p>

                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        <button
                            className={css.button}
                            disabled={isDeleting}
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}