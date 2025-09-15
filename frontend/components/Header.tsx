"use client";
import { useEffect, useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<string | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const API_ROOT = (process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/validate$/, '') || 'http://localhost:8080');
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.svg" alt="Logo" className="w-7 h-7" />
          <a href="/" className="font-bold">IaC Validator</a>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <a href="/validate" className="hover:underline">Validate</a>
          <a href="/help" className="hover:underline">Docs</a>
          <span className="relative">
            <button onClick={async () => {
              setShowVersions(v => !v);
              try {
                const r = await fetch(`${API_ROOT}/api/versions`);
                const j = await r.json();
                setVersions(`Terraform: ${j.terraform.stdout?.split('\n')[0]}\n${j.tflint.stdout?.trim()}\nCheckov ${j.checkov.stdout?.trim()}`);
              } catch { setVersions('Unavailable'); }
            }} className="hover:underline">Versions</button>
            {showVersions && (
              <div className="absolute right-0 mt-2 w-[28rem] max-w-[90vw] z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded">
                <div className="px-3 py-2">
                  <pre className="text-sm whitespace-pre-wrap m-0">{versions || 'Loading...'}</pre>
                </div>
                <div className="px-3 py-2 text-right border-t border-slate-200 dark:border-slate-700">
                  <button onClick={() => { setShowVersions(false); setVersions(null); }} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">Close</button>
                </div>
              </div>
            )}
          </span>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:underline">Report Issue</a>
          <span className="inline-flex items-center gap-1 text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${apiOk ? 'bg-green-500' : apiOk === false ? 'bg-red-500' : 'bg-gray-400'}`}></span>
            <button onClick={async () => {
              try { const r = await fetch(`${API_ROOT}/healthz`); setApiOk(r.ok); } catch { setApiOk(false); }
            }} className="hover:underline">API</button>
          </span>
          <button onClick={() => setDark(!dark)} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-sm">
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
        <button onClick={() => setOpen(!open)} className="sm:hidden px-2 py-1 rounded border border-slate-300 dark:border-slate-600 text-sm">Menu</button>
      </div>
      {open && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 px-6 pb-3">
          <div className="flex flex-col gap-2 pt-2">
            <a href="/validate" className="hover:underline">Validate</a>
            <a href="/help" className="hover:underline">Docs</a>
            <button onClick={async () => {
              setShowVersions(true);
              try {
                const r = await fetch(`${API_ROOT}/api/versions`);
                const j = await r.json();
                setVersions(`Terraform: ${j.terraform.stdout?.split('\n')[0]}\n${j.tflint.stdout?.trim()}\nCheckov ${j.checkov.stdout?.trim()}`);
              } catch { setVersions('Unavailable'); }
            }} className="hover:underline text-left">Versions</button>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:underline">Report Issue</a>
            <button onClick={async () => {
              try { const r = await fetch('http://localhost:8080/healthz'); setApiOk(r.ok); } catch { setApiOk(false); }
            }} className="hover:underline text-left">API Status</button>
            <button onClick={() => setDark(!dark)} className="px-2 py-1 w-fit rounded border border-slate-300 dark:border-slate-600 text-sm">
              {dark ? 'Light' : 'Dark'} mode
            </button>
          </div>
        </div>
      )}
      {/* removed bottom-right popup to avoid reappearing after close */}
    </div>
  );
}


