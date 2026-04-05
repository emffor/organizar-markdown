import { useEffect, useState, type FormEvent } from 'react';
import { isContentBlank } from '../lib/items';

interface AddMarkdownModalProps {
  open: boolean;
  isSaving?: boolean;
  mode?: 'create' | 'edit';
  initialValue?: string;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
}

export function AddMarkdownModal({
  open,
  isSaving = false,
  mode = 'create',
  initialValue = '',
  onClose,
  onSave,
}: AddMarkdownModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setValue('');
      setError('');
      return;
    }

    setValue(initialValue);
    setError('');
  }, [initialValue, open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isContentBlank(value)) {
      setError('Cole algum conteudo em markdown para continuar.');
      return;
    }

    await onSave(value);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="panel-surface w-full max-w-3xl p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-markdown-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-teal-700">
                {mode === 'edit' ? 'Editar card' : 'Novo card'}
              </p>
              <h2 id="add-markdown-title" className="m-0 text-2xl font-semibold text-slate-950">
                {mode === 'edit' ? 'Editar markdown' : 'Colar markdown'}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Fechar
            </button>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Conteudo
            <textarea
              autoFocus
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) {
                  setError('');
                }
              }}
              rows={14}
              placeholder={'# Titulo\n\nCole aqui o bloco em markdown.'}
              className="min-h-[280px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-6 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
          </label>

          {error ? <p className="m-0 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400"
            >
              {isSaving ? 'Salvando...' : mode === 'edit' ? 'Salvar alteracoes' : 'Salvar card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
