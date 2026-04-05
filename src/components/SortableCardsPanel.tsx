import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { MarkdownItem } from "../types/markdown";
import { SortableCard } from "./SortableCard";

interface SortableCardsPanelProps {
  items: MarkdownItem[];
  isLoading: boolean;
  isOutlineMode?: boolean;
  activeItemId?: string | null;
  onReorder: (activeId: string, overId: string) => Promise<void>;
  onSelect: (item: MarkdownItem) => void;
  onEdit: (item: MarkdownItem) => void;
  onDelete: (item: MarkdownItem) => void;
}

export function SortableCardsPanel({
  items,
  isLoading,
  isOutlineMode = false,
  activeItemId,
  onReorder,
  onSelect,
  onEdit,
  onDelete,
}: SortableCardsPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    await onReorder(String(active.id), String(over.id));
  };

  return (
    <section
      className={`flex flex-col lg:min-h-0 ${
        isOutlineMode
          ? "lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]"
          : "panel-surface min-h-[420px] p-5 sm:p-6"
      }`}
    >
      {isOutlineMode ? null : (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-[0.24em] text-teal-700/90">
              Coluna esquerda
            </p>
            <h2 className="m-0 text-[1.75rem] font-semibold tracking-[-0.03em] text-slate-950">
              Cards em ordem
            </h2>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500" />
          <p className="m-0 text-sm text-slate-500">
            Carregando cards salvos...
          </p>
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <span className="text-4xl" aria-hidden="true">
            +
          </span>
          <div>
            <p className="m-0 text-sm font-semibold text-slate-700">
              Nenhum card ainda
            </p>
            <p className="m-0 mt-1 text-sm leading-6 text-slate-500">
              Clique em <strong>Novo markdown</strong> ou pressione{" "}
              <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-xs">
                Ctrl+N
              </kbd>{" "}
              para comecar.
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className={`flex lg:flex-1 ${
                isOutlineMode
                  ? "flex-col gap-1.5 overflow-y-auto"
                  : "flex-col gap-2 overflow-y-auto pr-1"
              }`}
            >
              {items.map((item, index) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  position={index}
                  isOutlineMode={isOutlineMode}
                  isActive={item.id === activeItemId}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </section>
  );
}
