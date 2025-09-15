export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <main className="py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Improve your Terraform quickly</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">Format, validate, lint, and scan security with Terraform, TFLint, and Checkov. Get actionable results instantly.</p>
        <div className="flex items-center gap-4">
          <a href="/validate" className="inline-block bg-slate-800 text-white px-5 py-3 rounded-md hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition">Start validating</a>
          <a className="github-button" href="https://github.com/saivamshi4121/iac-fv" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star saivamshi4121/iac-fv on GitHub">Star</a>
        </div>
        <section className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5 transition hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="font-semibold mb-2">Terraform fmt and validate</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Enforce consistent formatting and catch syntax/config errors early.</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5 transition hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <div className="font-semibold mb-2">TFLint best practices</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Lint rules for providers and Terraform itself with links to docs.</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5 transition hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <div className="font-semibold mb-2">Checkov security</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Security misconfiguration scanning with clear pass/fail counts.</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5 transition hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <div className="font-semibold mb-2">Clean results UI</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Collapsible panels, summaries, and links for fast remediation.</p>
          </div>
        </section>

        <section className="mt-14 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">About this project</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              This tool helps you improve Infrastructure as Code quality. It automatically runs
              <strong> terraform fmt</strong>, <strong>terraform validate</strong>, <strong>TFLint</strong>, and
              <strong> Checkov</strong> on your Terraform snippets and shows readable results with links.
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Learn best practices with instant feedback.</li>
              <li>Catch syntax, configuration, and security issues early.</li>
              <li>No sign-in required; code is processed temporarily and not stored.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">How to use (beginners)</h2>
            <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Click <a className="text-blue-600 dark:text-blue-300 hover:underline" href="/validate">Start validating</a>.</li>
              <li>Paste a Terraform snippet in the editor (try an AWS S3 bucket).</li>
              <li>Press <span className="font-semibold">Run checks</span>.</li>
              <li>Expand panels to view <span className="font-semibold">Fmt</span>, <span className="font-semibold">Validate</span>, <span className="font-semibold">TFLint</span>, and <span className="font-semibold">Checkov</span> results.</li>
              <li>Follow links in messages to learn rules and fix issues.</li>
            </ol>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tip: open <a className="text-blue-600 dark:text-blue-300 hover:underline" href="/help">Docs</a> for examples and troubleshooting. Star or report issues on <a className="text-blue-600 dark:text-blue-300 hover:underline" href="https://github.com/saivamshi4121/iac-fv" target="_blank" rel="noreferrer">GitHub</a>.</p>
          </div>
        </section>
      </main>
    </div>
  );
}


