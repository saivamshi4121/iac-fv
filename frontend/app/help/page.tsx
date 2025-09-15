export default function HelpPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
      <h1>Help & FAQ</h1>
      <h2>What does this tool do?</h2>
      <p>It runs Terraform fmt/validate, TFLint, and Checkov on your Terraform code and shows the results.</p>
      <h2>Why do I see TFLint warnings?</h2>
      <p>Ensure you specify <code>required_providers</code> with version constraints in a <code>terraform</code> block.</p>
      <h2>Why are there no Checkov results?</h2>
      <p>Checkov focuses on cloud resources like AWS S3, IAM, etc. Use those in examples to see findings.</p>
      <h2>Where is my code stored?</h2>
      <p>Your code is processed in a temporary folder per request and not persisted by the backend.</p>
    </div>
  );
}


