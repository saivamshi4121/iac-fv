"use client";
import { useEffect, useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-bold">IaC Validator</a>
        <div className="flex items-center gap-4">
          <a href="/validate" className="hover:underline">Validate</a>
          <a href="/help" className="hover:underline">Help</a>
          <button onClick={() => setDark(!dark)} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-sm">
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </div>
    </div>
  );
}


