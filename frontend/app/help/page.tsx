"use client";
import { useMemo, useState, type ReactNode } from 'react';

type QA = { q: string; a: ReactNode };

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const items: QA[] = useMemo(() => ([
    {
      q: "What does this tool do?",
      a: (
        <p>It runs <strong>Terraform fmt/validate</strong>, <strong>TFLint</strong>, and <strong>Checkov</strong> on your Terraform code and returns structured results with summaries and links.</p>
      )
    },
    {
      q: "How do I fix TFLint required_providers warnings?",
      a: (
        <div>
          <p>Add a <code>terraform</code> block with <code>required_providers</code> and version constraints.</p>
          <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded text-sm overflow-auto">{`terraform {
  required_version = ">= 1.5.0, < 2.0.0"
  required_providers {
    aws  = { source = "hashicorp/aws",  version = "~> 5.0" }
    null = { source = "hashicorp/null", version = "~> 3.0" }
  }
}`}</pre>
          <div className="mt-2 text-sm">
            Docs: <a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://developer.hashicorp.com/terraform/language/providers/requirements" target="_blank" rel="noreferrer">Terraform provider requirements</a>
          </div>
        </div>
      )
    },
    {
      q: "Why do I see no Checkov results?",
      a: (
        <p>Checkov scans <em>cloud resources</em> (e.g., AWS S3, IAM). If your input only has local resources like <code>null_resource</code>, there may be zero resources to scan. Try an <code>aws_s3_bucket</code> example to see findings. Docs: <a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://www.checkov.io/" target="_blank" rel="noreferrer">Checkov</a>.</p>
      )
    },
    {
      q: "Troubleshooting: validation failed unexpectedly",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure the snippet is valid HCL and starts with a <code>terraform</code> or <code>provider</code> block.</li>
          <li>Pin provider versions in <code>required_providers</code>.</li>
          <li>For provider resolution issues, the backend uses <code>init -backend=false -upgrade</code>; re-run and check stderr.</li>
          <li>If a tool times out, reduce the snippet or try again; heavy modules are not supported in the demo.</li>
        </ul>
      )
    },
    {
      q: "How is my code handled?",
      a: (
        <p>Your code is written to a <strong>temporary directory</strong>, tools are executed with a <strong>timeout</strong>, and files are <strong>deleted</strong> after processing. No code is persisted server-side.</p>
      )
    },
    {
      q: "Useful links (Terraform, TFLint, Checkov)",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          <li><a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://developer.hashicorp.com/terraform/docs" target="_blank" rel="noreferrer">Terraform Docs</a></li>
          <li><a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://github.com/terraform-linters/tflint" target="_blank" rel="noreferrer">TFLint</a> and <a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://github.com/terraform-linters/tflint-ruleset-terraform" target="_blank" rel="noreferrer">Terraform rules</a></li>
          <li><a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://www.checkov.io/" target="_blank" rel="noreferrer">Checkov</a></li>
        </ul>
      )
    },
    {
      q: "Contact & feedback",
      a: (
        <p>Open an issue on our GitHub or email <a className="text-blue-600 dark:text-blue-300 hover:underline" href="mailto:contact@example.com">contact@example.com</a>.</p>
      )
    },
    {
      q: "Version & update log",
      a: (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>v1.0</strong> – Initial release with fmt/validate, TFLint, Checkov, and UI.</li>
        </ul>
      )
    }
  ]), []);

  const filtered = items.filter(i => i.q.toLowerCase().includes(query.toLowerCase()));
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Help & FAQ</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full mb-4 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
      />
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left px-4 py-3 flex items-center justify-between"
              >
                <span className="font-semibold">{item.q}</span>
                <span>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


