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
        className={`flex flex-col gap-3 border-b border-white/10 bg-ink text-white ${
          isCompactMode ? 'mb-0 rounded-none px-4 py-3 sm:px-5' : 'mb-3 rounded-[1.25rem] px-5 py-4 sm:px-6'
        }`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className={`${isPreviewMaximized ? 'max-w-2xl' : 'max-w-3xl'}`}>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.28em] text-teal-200/90">
              Organizar Markdown
            </p>
            <h1 className="m-0 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-50 sm:text-[2.7rem] lg:text-[3.1rem]">
              Cole blocos em markdown, reordene os cards e gere a versao final.
            </h1>
          </div>

          <div className="flex max-w-[42rem] flex-wrap items-center justify-start gap-1.5 sm:justify-end">
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
