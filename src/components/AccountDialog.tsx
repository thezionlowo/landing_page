import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function AccountDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => { if (dialog.open) dialog.close(); }; }, []);
  return <dialog ref={ref} className="site-account-dialog" aria-labelledby={id} onCancel={event => { event.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const box = e.currentTarget.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose(); } }}><header><h2 id={id}>{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></header>{children}</dialog>;
}
