export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <main className="py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Improve your Terraform quickly</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">Format, validate, lint, and scan security with Terraform, TFLint, and Checkov. Get actionable results instantly.</p>
        <a href="/validate" className="inline-block bg-slate-800 text-white px-5 py-3 rounded-md hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition">Start validating</a>
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
      </main>
    </div>
  );
}


