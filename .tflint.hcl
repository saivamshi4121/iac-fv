plugin "aws" {
  enabled = true
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
  version = "0.34.0"
}

config {
  call_module_type = "all"
}


