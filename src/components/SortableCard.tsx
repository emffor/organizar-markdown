import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getDisplayTitle } from "../lib/items";
import type { AppTheme } from "../lib/preferences";
import type { MarkdownItem } from "../types/markdown";

interface SortableCardProps {
  item: MarkdownItem;
  position: number;
  isOutlineMode?: boolean;
  isActive?: boolean;
  theme?: AppTheme;
  onSelect: (item: MarkdownItem) => void;
  onEdit: (item: MarkdownItem) => void;
  onDelete: (item: MarkdownItem) => void;
}

export function SortableCard({
  item,
  position,
  isOutlineMode = false,
  isActive = false,
  theme = "dark",
  onSelect,
  onEdit,
  onDelete,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const outlineContainerClass =
    theme === "dark"
      ? isActive
        ? "border-teal-400/60 bg-teal-400/10 shadow-[0_0_0_1px_rgba(45,212,191,0.12)]"
        : "border-slate-800/90 bg-[#111823]"
      : isActive
        ? "border-teal-500/60 bg-teal-50 shadow-[0_0_0_1px_rgba(13,148,136,0.08)]"
        : "border-slate-300 bg-white/95 shadow-sm";

  const outlineButtonClass =
    theme === "dark"
      ? isActive
        ? "border-teal-300/70 bg-teal-400/12 text-teal-200"
        : "border-slate-700/80 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-200"
      : isActive
        ? "border-teal-400/70 bg-teal-100 text-teal-800"
        : "border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`transition ${
        isOutlineMode
          ? `rounded-xl border ${outlineContainerClass}`
          : `rounded-[1.1rem] border px-4 py-3 ${
              isDragging
                ? "border-teal-300 bg-teal-50/40"
                : isActive
                  ? "border-teal-200 bg-teal-50/50"
                  : "border-slate-200/80 bg-white"
            }`
      }`}
    >
      <div className={`flex items-center ${isOutlineMode ? "gap-1" : "gap-3"}`}>
        {isOutlineMode ? null : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {String(position + 1).padStart(2, "0")}
          </span>
        )}
        {isOutlineMode ? (
          <>
            <button
              type="button"
              onClick={() => onSelect(item)}
              title={getDisplayTitle(item, 56)}
              aria-label={`Ir para ${getDisplayTitle(item, 56)}`}
              className={`flex h-12 w-full cursor-grab items-center justify-center rounded-[0.9rem] border px-2 text-[11px] font-bold tracking-[0.18em] transition active:cursor-grabbing ${outlineButtonClass}`}
              {...attributes}
              {...listeners}
            >
              <span className="truncate">
                {item.title?.trim()
                  ? getDisplayTitle(item, 20)
                  : String(position + 1).padStart(2, "0")}
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSelect(item)}
              title={getDisplayTitle(item, 56)}
              className="min-w-0 flex-1 cursor-grab truncate text-left text-[1.15rem] font-semibold leading-6 tracking-[-0.02em] text-slate-950 active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              {getDisplayTitle(item, 56)}
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Editar ${getDisplayTitle(item, 56)}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
              >
                <span aria-hidden="true">✎</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                aria-label={`Remover ${getDisplayTitle(item, 56)}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-rose-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
