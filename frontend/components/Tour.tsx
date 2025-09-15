"use client";
import { useEffect, useMemo, useState } from 'react';

type Step = { target: string; title: string; text: string; placement?: 'top'|'right'|'bottom'|'left' };

export default function Tour({ steps, storageKey = 'iac-tour-done' }: { steps: Step[]; storageKey?: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const done = typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true';
    if (!done) setOpen(true);
  }, [storageKey]);

  const step = steps[idx];
  const anchor = useMemo(() => (step ? document.querySelector(step.target) as HTMLElement | null : null), [step, idx, open]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  if (typeof document === 'undefined') return null;
  if (!open || !step || !anchor) return null;

  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const pos: any = {};
  const place = step.placement || 'right';
  if (place === 'right') { pos.top = rect.top + window.scrollY; pos.left = rect.right + window.scrollX + margin; }
  if (place === 'left') { pos.top = rect.top + window.scrollY; pos.left = rect.left + window.scrollX - 320 - margin; }
  if (place === 'top') { pos.top = rect.top + window.scrollY - 140 - margin; pos.left = rect.left + window.scrollX; }
  if (place === 'bottom') { pos.top = rect.bottom + window.scrollY + margin; pos.left = rect.left + window.scrollX; }

  const last = idx === steps.length - 1;

  function finish() {
    localStorage.setItem(storageKey, 'true');
    setOpen(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={finish} />
      <div className="fixed z-[61] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded p-3" style={pos}>
        <div className="font-semibold mb-1">{step.title}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{step.text}</div>
        <div className="flex justify-between">
          <button className="text-sm text-slate-600 dark:text-slate-300 hover:underline" onClick={finish}>Skip</button>
          <div className="flex gap-2">
            {idx > 0 && (
              <button className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-sm" onClick={() => setIdx(idx - 1)}>Back</button>
            )}
            <button className="px-2 py-1 rounded bg-slate-800 text-white text-sm" onClick={() => last ? finish() : setIdx(idx + 1)}>{last ? 'Done' : 'Next'}</button>
          </div>
        </div>
      </div>
    </>
  );
}


