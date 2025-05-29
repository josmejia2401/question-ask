################# IAM ####################

data "aws_iam_policy_document" "lambda_policy_document_auth_logout" {
  statement {
    actions = [
      "dynamodb:DeleteItem"
    ]
    resources = [
      "arn:aws:dynamodb:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:table/tbl-${var.app_name}-token-${var.env}"
    ]
  }
}

resource "aws_iam_role" "lambda_role_auth_logout" {
  name = "role-${var.app_name}-auth-logout-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_role_policy_auth_logout" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role_auth_logout.name
}

resource "aws_iam_policy" "dynamodb_lambda_policy_auth_logout" {
  name        = "policy-${var.app_name}-auth-logout-${var.env}"
  description = "This policy will be used by the lambda to write get data from DynamoDB"
  policy      = data.aws_iam_policy_document.lambda_policy_document_auth_logout.json
}

resource "aws_iam_role_policy_attachment" "lambda_attachements_auth_logout" {
  role       = aws_iam_role.lambda_role_auth_logout.name
  policy_arn = aws_iam_policy.dynamodb_lambda_policy_auth_logout.arn
}

################# LAMBDA ####################

data "archive_file" "lambda_package_auth_logout" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/auth-logout"
  output_path = "${path.root}/resources/auth-logout/index.zip"
}

resource "aws_lambda_function" "html_lambda_auth_logout" {
  filename         = data.archive_file.lambda_package_auth_logout.output_path
  function_name    = "lmb-${var.app_name}-auth-logout-${var.env}"
  role             = aws_iam_role.lambda_role_auth_logout.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x" # https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
  source_code_hash = data.archive_file.lambda_package_auth_logout.output_base64sha256
  timeout          = 30
  publish          = false
  tags             = var.tags
  architectures    = ["arm64"] #x86_64
  memory_size      = 128
}

resource "aws_cloudwatch_log_group" "html_loggroup_lambda_auth_logout" {
  name              = "/aws/lambda/${aws_lambda_function.html_lambda_auth_logout.function_name}"
  log_group_class   = "STANDARD"
  retention_in_days = 7
}

################# INTEGRATION ####################

resource "aws_apigatewayv2_integration" "lambda_handler_auth_logout" {
  api_id           = var.api_id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.html_lambda_auth_logout.invoke_arn
  depends_on       = [aws_lambda_function.html_lambda_auth_logout]
}

resource "aws_apigatewayv2_route" "handler_auth_logout" {
  api_id             = var.api_id
  route_key          = "POST /api/v1/auth/logout"
  target             = "integrations/${aws_apigatewayv2_integration.lambda_handler_auth_logout.id}"
  authorization_type = "NONE"
  authorizer_id      = 0
}

resource "aws_lambda_permission" "api_gw_auth_logout" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.html_lambda_auth_logout.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.selected.execution_arn}/*/*"
}
