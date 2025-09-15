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

## Deployment mapping

- `backend/` → Render (Docker web service)
  - Dockerfile: `backend/Dockerfile`
  - Health check: `/healthz`
  - Env: `PORT=8080`
- `frontend/` → Vercel (Next.js)
  - Root directory: `frontend`
  - Env: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com/api/validate`
- Other files (e.g., `main.tf`, `.tflint.hcl`, `.checkov.yaml`, `check.bat`, `check.sh`, `docker-compose.yml`) are examples and contributor tooling; they are not deployed.

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

## Frontend (optional)
A simple Next.js UI lives in `frontend/` with a Monaco editor and a results view.

### Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`. To point it at a different backend URL, set `NEXT_PUBLIC_API_URL` env var.


