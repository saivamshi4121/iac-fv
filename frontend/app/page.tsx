"use client";
import { useState } from 'react';
import Editor from '@monaco-editor/react';

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

export default function HomePage() {
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
      const resp = await fetch(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/validate', {
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
    // TFLint: non-zero often indicates issues, treat as warnings/errors
    const lintIssues = (() => {
      try {
        const idx = r.results.tflint.stdout.indexOf('{');
        const data = JSON.parse(idx >= 0 ? r.results.tflint.stdout.slice(idx) : '{}');
        return (data.issues ?? []).length;
      } catch { return r.results.tflint.code !== 0 ? 1 : 0; }
    })();
    // Checkov failed count
    const checkovFailed = (() => {
      try { return JSON.parse(r.results.checkov.stdout || '{}').failed ?? 0; } catch { return r.results.checkov.code !== 0 ? 1 : 0; }
    })();
    const allOk = okFmt && okInit && okVal && lintIssues === 0 && checkovFailed === 0;
    return { allOk, lintIssues, checkovFailed };
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1>IaC Formatter and Validator</h1>
      <div style={{ height: 380, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12 }}>
        <Editor
          height="100%"
          defaultLanguage="hcl"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <button onClick={onSubmit} disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Running…' : 'Run checks'}
      </button>
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: 8, background: '#f0f3f5', border: '1px solid #d6dbdf', borderRadius: 6 }}>
          <span className="spinner" aria-label="loading" />
          <span>Running Terraform fmt/init/validate, TFLint, and Checkov...</span>
        </div>
      )}
      {error && (
        <div style={{ color: 'white', background: '#c0392b', padding: 8, marginTop: 12 }}>{error}</div>
      )}
      {result && (
        <div style={{ marginTop: 16 }}>
          {(() => {
            const s = overallSummary(result);
            return (
              <div style={{
                background: s.allOk ? '#eafaf1' : '#fdecea',
                color: s.allOk ? '#1e8449' : '#c0392b',
                border: `1px solid ${s.allOk ? '#abebc6' : '#f5b7b1'}`,
                padding: 12, borderRadius: 8, marginBottom: 12
              }}>
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


