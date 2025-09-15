export const metadata = {
  title: 'IaC Formatter and Validator',
  description: 'Validate Terraform with fmt, validate, TFLint, and Checkov'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>{children}</body>
    </html>
  );
}


