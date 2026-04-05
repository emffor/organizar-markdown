import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { MarkdownItem } from '../types/markdown';
import { SortableCard } from './SortableCard';

interface SortableCardsPanelProps {
  items: MarkdownItem[];
  isLoading: boolean;
  isOutlineMode?: boolean;
  activeItemId?: string | null;
  onReorder: (activeId: string, overId: string) => Promise<void>;
  onSelect: (item: MarkdownItem) => void;
  onEdit: (item: MarkdownItem) => void;
}

export function SortableCardsPanel({
  items,
  isLoading,
  isOutlineMode = false,
  activeItemId,
  onReorder,
  onSelect,
  onEdit,
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
      className={`panel-surface flex min-h-[420px] flex-col lg:min-h-0 ${
        isOutlineMode
          ? 'p-2 sm:p-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]'
          : 'p-5 sm:p-6'
      }`}
    >
      <div className={`flex items-center justify-between gap-3 ${isOutlineMode ? 'mb-2' : 'mb-4'}`}>
        <div>
          {isOutlineMode ? (
            <>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-teal-700/90">
                Indice
              </p>
              <h2 className="m-0 text-[1rem] font-semibold tracking-[-0.03em] text-slate-950">
                Cards
              </h2>
            </>
          ) : (
            <>
              <p className="mb-1 text-sm font-medium uppercase tracking-[0.24em] text-teal-700/90">
                Coluna esquerda
              </p>
              <h2 className="m-0 text-[1.75rem] font-semibold tracking-[-0.03em] text-slate-950">
                Cards em ordem
              </h2>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-500">
          Carregando cards salvos...
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm leading-6 text-slate-500">
          Nenhum card ainda. Abra o modal, cole um markdown e monte a sequencia.
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div
              className={`flex lg:flex-1 ${
                isOutlineMode ? 'flex-col gap-2 overflow-y-auto pr-0' : 'flex-col gap-2 overflow-y-auto pr-1'
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </section>
  );
}
