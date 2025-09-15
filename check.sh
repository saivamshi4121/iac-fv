#!/usr/bin/env bash
set -euo pipefail

# Format
terraform fmt -recursive -check

# Validate (init without backend to avoid remote calls)
terraform init -backend=false -input=false -lock=false -upgrade >/dev/null
terraform validate

# TFLint
if command -v tflint >/dev/null 2>&1; then
  tflint --init >/dev/null
  tflint -f compact
else
  echo "TFLint not installed; skipping. Install from https://github.com/terraform-linters/tflint" >&2
fi

# Checkov
if command -v checkov >/dev/null 2>&1; then
  checkov -d . --framework terraform
else
  echo "Checkov not installed; skipping. Install via pip: pip install checkov" >&2
fi


