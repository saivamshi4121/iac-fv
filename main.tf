terraform {
  required_version = ">= 1.5.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "demo_bucket" {
  bucket = "saivamshi-terraform-20250805"
}

resource "aws_s3_bucket_acl" "demo_bucket_acl" {
  bucket = aws_s3_bucket.demo_bucket.id
  acl    = "private"
}

# Block public access for the bucket
resource "aws_s3_bucket_public_access_block" "demo_bucket_pab" {
  bucket                  = aws_s3_bucket.demo_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable bucket versioning
resource "aws_s3_bucket_versioning" "demo_bucket_versioning" {
  bucket = aws_s3_bucket.demo_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# KMS key for default encryption
resource "aws_kms_key" "s3_default_kms" {
  description         = "KMS key for default encryption of S3 bucket objects"
  enable_key_rotation = true
}

# Default encryption using KMS
resource "aws_s3_bucket_server_side_encryption_configuration" "demo_bucket_sse" {
  bucket = aws_s3_bucket.demo_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3_default_kms.arn
    }
  }
}

# Basic lifecycle configuration (example: abort incomplete multipart uploads)
resource "aws_s3_bucket_lifecycle_configuration" "demo_bucket_lifecycle" {
  bucket = aws_s3_bucket.demo_bucket.id

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Access logging: create a logs bucket and attach logging to the main bucket
resource "aws_s3_bucket" "logs_bucket" {
  bucket = "saivamshi-terraform-20250805-logs"
}

resource "aws_s3_bucket_ownership_controls" "logs_bucket_ownership" {
  bucket = aws_s3_bucket.logs_bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "logs_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.logs_bucket_ownership]
  bucket     = aws_s3_bucket.logs_bucket.id
  acl        = "log-delivery-write"
}

resource "aws_s3_bucket_logging" "demo_bucket_logging" {
  bucket = aws_s3_bucket.demo_bucket.id
  target_bucket = aws_s3_bucket.logs_bucket.id
  target_prefix = "s3-access-logs/"
}

# Event notifications: publish to an SNS topic
resource "aws_sns_topic" "demo_bucket_events" {
  name = "demo-bucket-events"
}

data "aws_iam_policy_document" "sns_topic_policy" {
  statement {
    actions = [
      "SNS:Publish"
    ]
    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }
    resources = [aws_sns_topic.demo_bucket_events.arn]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_s3_bucket.demo_bucket.arn]
    }
  }
}

resource "aws_sns_topic_policy" "demo_bucket_events_policy" {
  arn    = aws_sns_topic.demo_bucket_events.arn
  policy = data.aws_iam_policy_document.sns_topic_policy.json
}

resource "aws_s3_bucket_notification" "demo_bucket_notifications" {
  bucket = aws_s3_bucket.demo_bucket.id

  topic {
    topic_arn = aws_sns_topic.demo_bucket_events.arn
    events    = [
      "s3:ObjectCreated:*",
      "s3:ObjectRemoved:*"
    ]
  }
}
