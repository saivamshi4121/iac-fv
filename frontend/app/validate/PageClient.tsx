"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
import Tour from '../../components/Tour';

type ToolResult = { code: number; stdout: string; stderr: string };
type ApiResponse = {
  results: {
    fmt: ToolResult;
    init: ToolResult;
    validate: ToolResult;
    tflint: ToolResult;
    checkov: ToolResult;
  };
};

export default function ValidatePageClient() {
  const [code, setCode] = useState<string>(`terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}
resource "null_resource" "demo" {}
`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch(process.env.NEXT_PUBLIC_API_URL ?? 'https://iac-fv.onrender.com/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terraform: code })
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }
      const data = (await resp.json()) as ApiResponse;
      setResult(data);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function Section({ title, tr, children }: { title: string; tr?: ToolResult; children?: React.ReactNode }) {
    const ok = tr && tr.code === 0;
    const [open, setOpen] = useState(false);
    const statusColor = ok ? '#1e8449' : '#c0392b';
    return (
      <div style={{ border: '1px solid #e1e4e8', borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}>
        <button onClick={() => setOpen(!open)} style={{
          width: '100%', textAlign: 'left', background: '#f9fafb', padding: 12, cursor: 'pointer', border: 'none'
        }}>
          <span style={{ marginRight: 8 }}>{open ? '▼' : '▶'}</span>
          <span style={{ fontWeight: 600 }}>{title}</span>
          {tr && (
            <span style={{ float: 'right', color: statusColor }}>{ok ? 'Success' : 'Issues'}</span>
          )}
        </button>
        {open && (
          <div style={{ padding: 12 }}>
            {children}
            {tr && !children && (
              <pre style={{ whiteSpace: 'pre-wrap' }}>
{tr.stdout || ''}
{tr.stderr || ''}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  }

  function TflintIssues({ tr }: { tr: ToolResult }) {
    try {
      const idx = tr.stdout.indexOf('{');
      const jsonStr = idx >= 0 ? tr.stdout.slice(idx) : '{}';
      const data = JSON.parse(jsonStr) as { issues?: any[] };
      const issues = data.issues || [];
      if (!issues.length) return <div>No TFLint issues found.</div>;
      return (
        <div>
          {issues.map((i: any, k: number) => (
            <div key={k} style={{ marginBottom: 8, padding: 8, background: '#fff8e1', borderRadius: 6 }}>
              <div style={{ fontWeight: 600 }}>
                {i.rule?.name} ({i.rule?.severity || 'info'})
              </div>
              <div>{i.message}</div>
              {i.rule?.link && (
                <a href={i.rule.link} target="_blank" rel="noreferrer">Rule docs</a>
              )}
              {i.range?.filename && (
                <div style={{ color: '#555' }}>{i.range.filename}:{i.range.start?.line}</div>
              )}
            </div>
          ))}
        </div>
      );
    } catch {
      return <pre style={{ whiteSpace: 'pre-wrap' }}>{tr.stdout}</pre>;
    }
  }

  function CheckovSummary({ tr }: { tr: ToolResult }) {
    try {
      const data = JSON.parse(tr.stdout || '{}');
      const { passed = 0, failed = 0, skipped = 0, resource_count = 0 } = data as any;
      const pill = (label: string, val: number, color: string) => (
        <span style={{ background: color, color: 'white', borderRadius: 12, padding: '2px 8px', marginRight: 8 }}>{label}: {val}</span>
      );
      return (
        <div>
          <div style={{ marginBottom: 6 }}>Resources: {resource_count}</div>
          <div>
            {pill('Passed', passed, '#1e8449')}
            {pill('Failed', failed, '#c0392b')}
            {pill('Skipped', skipped, '#7f8c8d')}
          </div>
        </div>
      );
    } catch {
      return <pre style={{ whiteSpace: 'pre-wrap' }}>{tr.stdout}</pre>;
    }
  }

  function overallSummary(r: ApiResponse) {
    const okFmt = r.results.fmt.code === 0;
    const okInit = r.results.init.code === 0;
    const okVal = r.results.validate.code === 0;
    const lintIssues = (() => {
      try {
        const idx = r.results.tflint.stdout.indexOf('{');
        const data = JSON.parse(idx >= 0 ? r.results.tflint.stdout.slice(idx) : '{}');
        return (data.issues ?? []).length;
      } catch { return r.results.tflint.code !== 0 ? 1 : 0; }
    })();
    const checkovFailed = (() => {
      try { return JSON.parse(r.results.checkov.stdout || '{}').failed ?? 0; } catch { return r.results.checkov.code !== 0 ? 1 : 0; }
    })();
    const allOk = okFmt && okInit && okVal && lintIssues === 0 && checkovFailed === 0;
    return { allOk, lintIssues, checkovFailed };
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Tour steps={[
        { target: 'h1', title: 'Welcome', text: 'Paste Terraform, run checks, and see results — quickly.' },
        { target: '#tf-editor', title: 'Editor', text: 'Paste your Terraform code here to start validation.', placement: 'bottom' },
        { target: '#run-btn', title: 'Run checks', text: "Click 'Run checks' to format, validate, lint, and scan security.", placement: 'top' },
        { target: '#results-panel', title: 'Results', text: 'See detailed results here, with warnings and errors clearly indicated.', placement: 'top' },
      ]} />
      <h1 className="text-2xl font-bold mb-4">Validate Terraform</h1>
      <div id="tf-editor" className="h-[380px] border border-slate-200 dark:border-slate-700 rounded-lg mb-3">
        <Editor
          height="100%"
          defaultLanguage="hcl"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <button id="run-btn" onClick={onSubmit} disabled={loading} className="px-4 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60">
        {loading ? 'Running…' : 'Run checks'}
      </button>
      {loading && (
        <div className="flex items-center gap-2 mt-3 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
          <span className="spinner" aria-label="loading" />
          <span>Running Terraform fmt/init/validate, TFLint, and Checkov...</span>
        </div>
      )}
      {error && (
        <div className="mt-3 p-2 rounded text-white bg-red-700">{error}</div>
      )}
      {result && (
        <div id="results-panel" className="mt-4">
          {(() => {
            const s = overallSummary(result);
            return (
              <div className={`mb-3 p-3 rounded border ${s.allOk ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {s.allOk ? 'All checks passed' : `Issues found: TFLint=${s.lintIssues}, Checkov failed=${s.checkovFailed}`}
              </div>
            );
          })()}
          <Section title="Format" tr={result.results.fmt} />
          <Section title="Init" tr={result.results.init} />
          <Section title="Validate" tr={result.results.validate} />
          <Section title="TFLint" tr={result.results.tflint}>
            <TflintIssues tr={result.results.tflint} />
          </Section>
          <Section title="Checkov" tr={result.results.checkov}>
            <CheckovSummary tr={result.results.checkov} />
          </Section>
        </div>
      )}
      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #95a5a6;
          border-top-color: #2c3e50;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


