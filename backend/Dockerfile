# syntax=docker/dockerfile:1
FROM debian:bookworm-slim

ARG TERRAFORM_VERSION=1.9.5
ARG TFLINT_VERSION=0.59.1

ENV DEBIAN_FRONTEND=noninteractive \
    CHECKOV_VERSION=latest

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl unzip ca-certificates python3-pip git \
 && rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN curl -fsSLo /tmp/terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
 && unzip /tmp/terraform.zip -d /usr/local/bin \
 && rm /tmp/terraform.zip \
 && terraform -version

# Install TFLint
RUN curl -fsSLo /tmp/tflint.zip https://github.com/terraform-linters/tflint/releases/download/v${TFLINT_VERSION}/tflint_linux_amd64.zip \
 && unzip /tmp/tflint.zip -d /usr/local/bin \
 && rm /tmp/tflint.zip \
 && tflint --version

# Install Checkov
RUN pip install --no-cache-dir checkov==3.* \
 && checkov -v || true

WORKDIR /app

# Install Node deps (no lockfile in repo, so use npm install to avoid noisy ci errors)
COPY package*.json ./
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/* \
 && npm install --omit=dev

COPY . .

EXPOSE 8080
CMD ["npm", "start"]

