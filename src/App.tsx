import { useEffect, useRef, useState } from 'react';
import { AppShell } from './components/AppShell';
import { AddMarkdownModal } from './components/AddMarkdownModal';
import { CombinedOutputPanel } from './components/CombinedOutputPanel';
import { SortableCardsPanel } from './components/SortableCardsPanel';
import { useMarkdownBoard } from './hooks/useMarkdownBoard';
import { createBackupText, parseBackupText } from './lib/backup';
import {
  type AppTheme,
  clampFontScale,
  FONT_SCALE,
  readStoredCompactMode,
  readStoredFontScale,
  readStoredOutlineMode,
  readStoredPreviewMaximized,
  readStoredTheme,
  STORAGE_KEYS,
} from './lib/preferences';
import type { MarkdownItem } from './types/markdown';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MarkdownItem | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(readStoredCompactMode);
  const [isOutlineMode, setIsOutlineMode] = useState(readStoredOutlineMode);
  const [fontScale, setFontScale] = useState(readStoredFontScale);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(readStoredPreviewMaximized);
  const [theme, setTheme] = useState<AppTheme>(readStoredTheme);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    items,
    addItem,
    updateItem,
    reorderItems,
    clearItems,
    replaceItems,
    isLoading,
  } = useMarkdownBoard();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.compactMode, String(isCompactMode));
  }, [isCompactMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.fontScale, String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.outlineMode, String(isOutlineMode));
  }, [isOutlineMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.previewMaximized, String(isPreviewMaximized));
  }, [isPreviewMaximized]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    if (items.length === 0) {
      setActiveItemId(null);
      return;
    }

    if (!activeItemId || !items.some((item) => item.id === activeItemId)) {
      setActiveItemId(items[0].id);
    }
  }, [activeItemId, items]);

  const handleSave = async (content: string) => {
    setIsSaving(true);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, content);
      } else {
        await addItem(content);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = async () => {
    if (items.length === 0) {
      return;
    }

    if (!window.confirm('Deseja remover todos os cards salvos?')) {
      return;
    }

    await clearItems();
  };

  const handleExport = () => {
    const backupText = createBackupText(items);
    const blob = new Blob([backupText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'organizar-markdown-backup.txt';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const importedItems = parseBackupText(rawText);
      await replaceItems(importedItems);
    } catch {
      window.alert('Nao foi possivel importar este arquivo .txt.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSelectItem = (item: MarkdownItem) => {
    setActiveItemId(item.id);
    document.getElementById(`preview-item-${item.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain,application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      <AppShell
        itemsCount={items.length}
        isCompactMode={isCompactMode}
        isPreviewMaximized={isPreviewMaximized}
        isOutlineMode={isOutlineMode}
        theme={theme}
        fontScale={fontScale}
        onOpenModal={() => setIsModalOpen(true)}
        onToggleCompactMode={() => setIsCompactMode((current) => !current)}
        onTogglePreviewMaximized={() => setIsPreviewMaximized((current) => !current)}
        onToggleOutlineMode={() => setIsOutlineMode((current) => !current)}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onClearAll={() => {
          void handleClearAll();
        }}
        onDecreaseFont={() => setFontScale((current) => clampFontScale(current - FONT_SCALE.step))}
        onIncreaseFont={() => setFontScale((current) => clampFontScale(current + FONT_SCALE.step))}
        onExport={handleExport}
        onImport={handleImportClick}
        leftPanel={
          <SortableCardsPanel
            items={items}
            isLoading={isLoading}
            isOutlineMode={isOutlineMode}
            activeItemId={activeItemId}
            onReorder={reorderItems}
            onSelect={handleSelectItem}
            onEdit={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
          />
        }
        rightPanel={
          <CombinedOutputPanel
            items={items}
            isLoading={isLoading}
            theme={theme}
            activeItemId={activeItemId}
          />
        }
      />

      <AddMarkdownModal
        open={isModalOpen}
        isSaving={isSaving}
        mode={editingItem ? 'edit' : 'create'}
        initialValue={editingItem?.content ?? ''}
        onClose={() => {
          if (!isSaving) {
            setIsModalOpen(false);
            setEditingItem(null);
          }
        }}
        onSave={handleSave}
      />
    </>
  );
}
