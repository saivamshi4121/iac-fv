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

  function Section({ title, tr }: { title: string; tr?: ToolResult }) {
    const ok = tr && tr.code === 0;
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          {title} {tr ? (ok ? '✅' : '❌') : ''}
        </div>
        {tr && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
{tr.stdout || ''}
{tr.stderr || ''}
          </pre>
        )}
      </div>
    );
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
      {error && (
        <div style={{ color: 'white', background: '#c0392b', padding: 8, marginTop: 12 }}>{error}</div>
      )}
      {result && (
        <div style={{ marginTop: 16 }}>
          <Section title="Format" tr={result.results.fmt} />
          <Section title="Init" tr={result.results.init} />
          <Section title="Validate" tr={result.results.validate} />
          <Section title="TFLint" tr={result.results.tflint} />
          <Section title="Checkov" tr={result.results.checkov} />
        </div>
      )}
    </div>
  );
}


