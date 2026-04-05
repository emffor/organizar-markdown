import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getCardTitle } from '../lib/items';
import type { MarkdownItem } from '../types/markdown';

interface SortableCardProps {
  item: MarkdownItem;
  position: number;
  isOutlineMode?: boolean;
  isActive?: boolean;
  onSelect: (item: MarkdownItem) => void;
  onEdit: (item: MarkdownItem) => void;
}

export function SortableCard({
  item,
  position,
  isOutlineMode = false,
  isActive = false,
  onSelect,
  onEdit,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`border bg-white transition ${
        isOutlineMode
          ? `rounded-2xl px-2 py-2 ${isActive ? 'border-teal-300 bg-teal-50/80 shadow-sm' : 'border-slate-200/80'}`
          : `rounded-[1.1rem] px-4 py-3 ${
              isDragging ? 'border-teal-300 bg-teal-50/40' : isActive ? 'border-teal-200 bg-teal-50/50' : 'border-slate-200/80'
            }`
      }`}
    >
      <div className={`flex items-center ${isOutlineMode ? 'flex-col gap-2' : 'gap-3'}`}>
        {isOutlineMode ? null : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {String(position + 1).padStart(2, '0')}
          </span>
        )}
        <button
          type="button"
          onClick={() => onSelect(item)}
          title={getCardTitle(item.content, 56)}
          className={`cursor-grab text-slate-950 active:cursor-grabbing ${
            isOutlineMode
              ? 'hidden'
              : 'min-w-0 flex-1 truncate text-left text-[1.15rem] font-semibold leading-6 tracking-[-0.02em]'
          }`}
          {...attributes}
          {...listeners}
        >
          {getCardTitle(item.content, 56)}
        </button>
        {isOutlineMode ? (
          <>
            <button
              type="button"
              onClick={() => onSelect(item)}
              title={getCardTitle(item.content, 56)}
              aria-label={`Ir para ${getCardTitle(item.content, 56)}`}
              className={`flex h-14 w-full cursor-grab items-center justify-center rounded-xl border px-1 text-center text-sm font-semibold tracking-[0.16em] active:cursor-grabbing ${
                isActive
                  ? 'border-teal-300 bg-teal-100 text-teal-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
              {...attributes}
              {...listeners}
            >
              {String(position + 1).padStart(2, '0')}
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              aria-label={`Editar ${getCardTitle(item.content, 56)}`}
              className="inline-flex h-7 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            >
              Editar
            </button>
          </>
        ) : null}
        {isOutlineMode ? null : (
          <button
            type="button"
            onClick={() => onEdit(item)}
            aria-label={`Editar ${getCardTitle(item.content, 56)}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <span aria-hidden="true">✎</span>
          </button>
        )}
      </div>
    </article>
  );
}
