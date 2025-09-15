"use client";
import { useEffect, useMemo, useState } from 'react';

type Step = { target: string; title: string; text: string; placement?: 'top'|'right'|'bottom'|'left' };

export default function Tour({ steps, storageKey = 'iac-tour-done' }: { steps: Step[]; storageKey?: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<{top:number;left:number;width:number;height:number}|null>(null);

  // Start tour only on client and only once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const done = localStorage.getItem(storageKey) === 'true';
    if (!done) setOpen(true);
  }, [storageKey]);

  const step = steps[idx];

  // Compute anchor rect after mount and on step changes (client-only)
  useEffect(() => {
    if (!open || !step) { setRect(null); return; }
    if (typeof document === 'undefined') { setRect(null); return; }
    const el = document.querySelector(step.target) as HTMLElement | null;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height });
  }, [open, step]);

  const pos = useMemo(() => {
    const margin = 10;
    if (!rect || !step) return { top: 80, left: 20 } as any;
    const p = step.placement || 'right';
    if (p === 'right') return { top: rect.top, left: rect.left + rect.width + margin } as any;
    if (p === 'left') return { top: rect.top, left: Math.max(10, rect.left - 300 - margin) } as any;
    if (p === 'top') return { top: Math.max(10, rect.top - 140 - margin), left: rect.left } as any;
    return { top: rect.top + rect.height + margin, left: rect.left } as any; // bottom
  }, [rect, step]);

  if (!open || !step) return null;
  const last = idx === steps.length - 1;
  function finish() {
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, 'true');
    setOpen(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={finish} />
      <div className="fixed z-[61] max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded p-3" style={pos as any}>
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


