@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem Format
echo Running terraform fmt...
terraform fmt -recursive -check
if %errorlevel% neq 0 exit /b %errorlevel%

rem Validate (init without backend to avoid remote calls)
echo Running terraform init (no backend, upgrade providers)...
terraform init -backend=false -input=false -lock=false -upgrade >NUL
if %errorlevel% neq 0 exit /b %errorlevel%
echo Running terraform validate...
terraform validate
if %errorlevel% neq 0 exit /b %errorlevel%

rem TFLint
echo Running TFLint...
where tflint >NUL 2>&1
if %errorlevel%==0 (
  tflint --init >NUL
  if %errorlevel% neq 0 exit /b %errorlevel%
  tflint -f compact
  if %errorlevel% neq 0 exit /b %errorlevel%
) else (
  echo TFLint not installed; skipping. Install from https://github.com/terraform-linters/tflint 1>&2
)

rem Checkov
echo Running Checkov...
where checkov >NUL 2>&1
if %errorlevel%==0 (
  checkov -d . --framework terraform
  if %errorlevel% neq 0 exit /b %errorlevel%
) else (
  echo Checkov not installed; skipping. Install via pip: pip install checkov 1>&2
)

endlocal
pause
