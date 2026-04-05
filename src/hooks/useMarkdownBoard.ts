import { useEffect, useMemo, useState } from 'react';
import { db } from '../lib/db';
import { buildCombinedContent, isContentBlank, reorderMarkdownItems } from '../lib/items';
import type { MarkdownItem } from '../types/markdown';

export interface UseMarkdownBoardResult {
  items: MarkdownItem[];
  combinedContent: string;
  isLoading: boolean;
  addItem: (content: string, title?: string) => Promise<void>;
  updateItem: (itemId: string, content: string, title?: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  reorderItems: (activeId: string, overId: string) => Promise<void>;
  clearItems: () => Promise<void>;
  replaceItems: (nextItems: MarkdownItem[]) => Promise<void>;
}

async function loadItems(): Promise<MarkdownItem[]> {
  return db.items.orderBy('order').toArray();
}

export function useMarkdownBoard(): UseMarkdownBoardResult {
  const [items, setItems] = useState<MarkdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const storedItems = await loadItems();

      if (!isMounted) {
        return;
      }

      setItems(storedItems);
      setIsLoading(false);
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const combinedContent = useMemo(() => buildCombinedContent(items), [items]);

  const addItem = async (content: string, title?: string) => {
    if (isContentBlank(content)) {
      return;
    }

    const cleanTitle = title?.trim() || undefined;
    const timestamp = new Date().toISOString();
    const nextItem: MarkdownItem = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      content,
      order: items.length,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setItems((currentItems) => [...currentItems, nextItem]);
    await db.items.put(nextItem);
  };

  const updateItem = async (itemId: string, content: string, title?: string) => {
    if (isContentBlank(content)) {
      return;
    }

    const currentItem = items.find((item) => item.id === itemId);
    if (!currentItem) {
      return;
    }

    const cleanTitle = title?.trim() || undefined;
    const timestamp = new Date().toISOString();
    const updatedItem: MarkdownItem = {
      ...currentItem,
      title: cleanTitle,
      content,
      updatedAt: timestamp,
    };

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? updatedItem : item)),
    );
    await db.items.put(updatedItem);
  };

  const deleteItem = async (itemId: string) => {
    const now = new Date().toISOString();
    const remaining = items
      .filter((item) => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index, updatedAt: now }));

    setItems(remaining);
    await db.transaction('rw', db.items, async () => {
      await db.items.delete(itemId);
      if (remaining.length > 0) {
        await db.items.bulkPut(remaining);
      }
    });
  };

  const reorderItems = async (activeId: string, overId: string) => {
    const reorderedItems = reorderMarkdownItems(items, activeId, overId);

    if (reorderedItems === items) {
      return;
    }

    setItems(reorderedItems);
    await db.transaction('rw', db.items, async () => {
      await db.items.bulkPut(reorderedItems);
    });
  };

  const clearItems = async () => {
    setItems([]);
    await db.items.clear();
  };

  const replaceItems = async (nextItems: MarkdownItem[]) => {
    setItems(nextItems);
    await db.transaction('rw', db.items, async () => {
      await db.items.clear();
      if (nextItems.length > 0) {
        await db.items.bulkPut(nextItems);
      }
    });
  };

  return {
    items,
    combinedContent,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    clearItems,
    replaceItems,
  };
}
