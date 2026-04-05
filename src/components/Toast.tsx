import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

function ToastItem({ message, onDismiss }: { message: ToastMessage; onDismiss: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(message.id), 300);
    }, 2800);

    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const colorMap: Record<string, string> = {
    success: 'border-teal-500/40 bg-teal-950/90 text-teal-200',
    error: 'border-rose-500/40 bg-rose-950/90 text-rose-200',
    info: 'border-sky-500/40 bg-sky-950/90 text-sky-200',
  };

  const colors = colorMap[message.type ?? 'success'] ?? colorMap.success;

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${colors} ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      {message.text}
    </div>
  );
}

export function ToastContainer({ messages, onDismiss }: ToastProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
