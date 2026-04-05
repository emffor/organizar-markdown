import type { ReactNode } from 'react';

import type { AppTheme } from '../lib/preferences';

interface AppShellProps {
  itemsCount: number;
  isCompactMode: boolean;
  isPreviewMaximized: boolean;
  isOutlineMode: boolean;
  theme: AppTheme;
  fontScale: number;
  onOpenModal: () => void;
  onToggleCompactMode: () => void;
  onTogglePreviewMaximized: () => void;
  onToggleOutlineMode: () => void;
  onToggleTheme: () => void;
  onClearAll: () => void;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  onExport: () => void;
  onImport: () => void;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function AppShell({
  itemsCount,
  isCompactMode,
  isPreviewMaximized,
  isOutlineMode,
  theme,
  fontScale,
  onOpenModal,
  onToggleCompactMode,
  onTogglePreviewMaximized,
  onToggleOutlineMode,
  onToggleTheme,
  onClearAll,
  onDecreaseFont,
  onIncreaseFont,
  onExport,
  onImport,
  leftPanel,
  rightPanel,
}: AppShellProps) {
  return (
    <main
      data-layout-mode={isCompactMode ? 'compact' : 'default'}
      data-theme={theme}
      className={`flex min-h-screen w-full flex-col ${
        isCompactMode ? 'px-0 py-0' : 'px-4 py-6 sm:px-6 lg:px-8'
      }`}
      style={{ ['--font-scale' as string]: String(fontScale) }}
    >
      <header
        className={`flex flex-col gap-4 border-b border-white/10 bg-ink text-white ${
          isCompactMode ? 'mb-0 rounded-none px-5 py-4 sm:px-6' : 'mb-4 rounded-[1.5rem] px-6 py-5 sm:px-8'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className={`${isPreviewMaximized ? 'max-w-3xl' : 'max-w-4xl'}`}>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.26em] text-teal-200/90">
              Organizar Markdown
            </p>
            <h1 className="m-0 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-slate-50 sm:text-4xl lg:text-5xl">
              Cole blocos em markdown, reordene os cards e gere a versao final.
            </h1>
          </div>

          <div className="flex max-w-[42rem] flex-wrap items-center justify-start gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onTogglePreviewMaximized}
              className="toolbar-button toolbar-button--primary"
            >
              {isPreviewMaximized ? 'Restaurar colunas' : 'Maximizar preview'}
            </button>
            <button
              type="button"
              onClick={onToggleCompactMode}
              className="toolbar-button"
            >
              {isCompactMode ? 'Restaurar espacamento' : 'Usar tela inteira'}
            </button>
            <button
              type="button"
              onClick={onToggleOutlineMode}
              className="toolbar-button"
            >
              {isOutlineMode ? 'Restaurar cards' : 'Modo indice'}
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="toolbar-button"
            >
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </button>
            <button
              type="button"
              onClick={onDecreaseFont}
              className="toolbar-button toolbar-button--icon"
            >
              A-
            </button>
            <button
              type="button"
              onClick={onIncreaseFont}
              className="toolbar-button toolbar-button--icon"
            >
              A+
            </button>
            <button
              type="button"
              onClick={onImport}
              className="toolbar-button"
            >
              Importar .txt
            </button>
            <button
              type="button"
              onClick={onExport}
              className="toolbar-button"
            >
              Exportar .txt
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="toolbar-button toolbar-button--danger"
            >
              Limpar tudo
            </button>
            <span className="toolbar-badge">
              {itemsCount} card{itemsCount === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              onClick={onOpenModal}
              className="toolbar-button toolbar-button--accent"
            >
              Novo markdown
            </button>
          </div>
        </div>
      </header>

      <section
        className={`grid flex-1 ${
          isPreviewMaximized
            ? 'grid-cols-1'
            : isOutlineMode
              ? `lg:grid-cols-[120px_minmax(0,1fr)] ${isCompactMode ? 'gap-0' : 'gap-4'}`
              : `lg:grid-cols-[minmax(280px,0.33fr)_minmax(0,0.67fr)] ${isCompactMode ? 'gap-0' : 'gap-6'}`
        }`}
      >
        {isPreviewMaximized ? null : leftPanel}
        {rightPanel}
      </section>
    </main>
  );
}
