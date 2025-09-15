import './globals.css';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'IaC Formatter and Validator',
  description: 'Validate Terraform with fmt, validate, TFLint, and Checkov'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const Header = dynamic(() => import('../components/Header'), { ssr: false });
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif', margin: 0 }}>
        {/* Client header with theme toggle via dynamic import to avoid SSR mismatch */}
        <Header />
        <div style={{ padding: 0 }}>{children}</div>
      </body>
    </html>
  );
}


