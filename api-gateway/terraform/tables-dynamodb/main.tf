resource "aws_dynamodb_table" "tbl_users" {
  name         = local.tbl_users
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "N"
  }

  tags = var.tags
}

resource "aws_dynamodb_table" "tbl_token" {
  name         = local.tbl_token
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "N"
  }

  tags = var.tags
}

resource "aws_dynamodb_table" "tbl_contents" {
  name         = local.tbl_contents
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "userId"

  attribute {
    name = "id"
    type = "N"
  }
  attribute {
    name = "userId"
    type = "N"
  }

  tags = var.tags
}
