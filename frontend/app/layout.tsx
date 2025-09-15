import './globals.css';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IaC Formatter and Validator',
  description: 'Validate Terraform with fmt, validate, TFLint, and Checkov'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const Header = dynamic(() => import('../components/Header'), { ssr: false });
  return (
    <html lang="en">
      <body className={`${inter.className}`} style={{ margin: 0 }}>
        {/* Client header with theme toggle via dynamic import to avoid SSR mismatch */}
        <Header />
        <div style={{ padding: 0 }}>{children}</div>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <footer className="border-t border-slate-200 dark:border-slate-800 mt-10">
          <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} IaC Validator</span>
            <div className="flex gap-4">
              <a href="/help" className="hover:underline">Help</a>
              <a href="https://github.com/saivamshi4121/iac-fv" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


