import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AddMarkdownModal } from "./components/AddMarkdownModal";
import { CombinedOutputPanel } from "./components/CombinedOutputPanel";
import { SortableCardsPanel } from "./components/SortableCardsPanel";
import { ToastContainer } from "./components/Toast";
import { useMarkdownBoard } from "./hooks/useMarkdownBoard";
import { useToast } from "./hooks/useToast";
import { createBackupText, parseBackupText } from "./lib/backup";
import { buildCombinedContent, getDisplayTitle } from "./lib/items";
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
} from "./lib/preferences";
import type { MarkdownItem } from "./types/markdown";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MarkdownItem | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(readStoredCompactMode);
  const [isOutlineMode, setIsOutlineMode] = useState(readStoredOutlineMode);
  const [fontScale, setFontScale] = useState(readStoredFontScale);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(
    readStoredPreviewMaximized,
  );
  const [theme, setTheme] = useState<AppTheme>(readStoredTheme);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    clearItems,
    replaceItems,
    isLoading,
  } = useMarkdownBoard();
  const { messages, addToast, dismissToast } = useToast();

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.compactMode,
      String(isCompactMode),
    );
  }, [isCompactMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.fontScale, String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.outlineMode,
      String(isOutlineMode),
    );
  }, [isOutlineMode]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.previewMaximized,
      String(isPreviewMaximized),
    );
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

  const handleSave = async (content: string, title?: string) => {
    setIsSaving(true);

    try {
      if (editingItem) {
        await updateItem(editingItem.id, content, title);
        addToast("Card atualizado com sucesso");
      } else {
        await addItem(content, title);
        addToast("Novo card adicionado");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = async () => {
    if (items.length === 0) {
      return;
    }

    if (!window.confirm("Deseja remover todos os cards salvos?")) {
      return;
    }

    await clearItems();
    addToast("Todos os cards foram removidos", "info");
  };

  const handleExport = () => {
    const backupText = createBackupText(items);
    const blob = new Blob([backupText], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "organizar-markdown-backup.txt";
    anchor.click();
    window.URL.revokeObjectURL(url);
    addToast(`Backup exportado com ${items.length} card(s)`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const importedItems = parseBackupText(rawText);
      await replaceItems(importedItems);
      addToast(`${importedItems.length} card(s) importado(s) com sucesso`);
    } catch {
      addToast("Nao foi possivel importar este arquivo.", "error");
    } finally {
      event.target.value = "";
    }
  };

  const handleDeleteItem = async (item: MarkdownItem) => {
    if (!window.confirm(`Remover card "${getDisplayTitle(item, 40)}"?`)) {
      return;
    }
    await deleteItem(item.id);
    addToast("Card removido", "info");
  };

  const handleCopyAll = useCallback(async () => {
    if (items.length === 0) {
      addToast("Nenhum card para copiar", "error");
      return;
    }
    const combined = buildCombinedContent(items);
    await navigator.clipboard.writeText(combined);
    addToast("Markdown copiado para a area de transferencia");
  }, [items, addToast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelectItem = (item: MarkdownItem) => {
    setActiveItemId(item.id);
    document.getElementById(`preview-item-${item.id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
        onTogglePreviewMaximized={() =>
          setIsPreviewMaximized((current) => !current)
        }
        onToggleOutlineMode={() => setIsOutlineMode((current) => !current)}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onClearAll={() => {
          void handleClearAll();
        }}
        onDecreaseFont={() =>
          setFontScale((current) => clampFontScale(current - FONT_SCALE.step))
        }
        onIncreaseFont={() =>
          setFontScale((current) => clampFontScale(current + FONT_SCALE.step))
        }
        onExport={handleExport}
        onImport={handleImportClick}
        onCopyAll={() => {
          void handleCopyAll();
        }}
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
            onDelete={(item) => {
              void handleDeleteItem(item);
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
        mode={editingItem ? "edit" : "create"}
        initialValue={editingItem?.content ?? ""}
        initialTitle={editingItem?.title ?? ""}
        theme={theme}
        onClose={() => {
          if (!isSaving) {
            setIsModalOpen(false);
            setEditingItem(null);
          }
        }}
        onSave={handleSave}
      />

      <ToastContainer messages={messages} onDismiss={dismissToast} />
    </>
  );
}
