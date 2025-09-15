## IaC Script Formatter and Validator

This repo automates formatting, validation, linting, and basic security checks for Terraform.

### Prerequisites (local)
- Terraform
- Optional: TFLint (`https://github.com/terraform-linters/tflint`)
- Optional: Checkov (`pip install checkov`)

### Quick start (local)
- Windows: run `check.bat`
- macOS/Linux: run `./check.sh`

What it runs:
1. `terraform fmt -recursive -check`
2. `terraform init -backend=false` and `terraform validate`
3. `tflint --init` and `tflint`
4. `checkov -d . --framework terraform`

### CI (GitHub Actions)
A workflow in `.github/workflows/check.yml` runs on every push and PR: fmt, validate, TFLint, and Checkov.

### Notes
- Validation uses `-backend=false` to avoid touching remote backends.
- TFLint will auto-download its rules on first run.
- Checkov runs with Terraform framework checks.

## Web API (optional)
An Express backend exposes `/api/validate` to run the same checks on submitted Terraform.

### Run with Docker
```bash
docker compose up --build
```
Then POST to `http://localhost:8080/api/validate` with JSON:
```json
{ "terraform": "provider \"aws\" { region=\"us-west-2\" }" }
```

### Local (without Docker)
```bash
cd backend
npm install
npm start
```
Endpoint: `http://localhost:8080/api/validate`


