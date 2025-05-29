terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      iac = "terraform"
    }
  }
  #access_key = "my-access-key"
  #secret_key = "my-secret-key"
}

####################
# DYNAMO
####################

module "tables_dynamodb" {
  source = "./terraform/tables-dynamodb"
}

####################
# API GATEWAY
####################

module "apigateway" {
  source     = "./terraform/apigateway"
  depends_on = [module.tables_dynamodb]
}

####################
# API GATEWAY RESOURCES
####################

module "apigateway_resource_authorization" {
  source     = "./terraform/apigateway-resource-authorizer"
  depends_on = [module.tables_dynamodb, module.apigateway]
  api_id     = module.apigateway.api_id # < output of module.api_gateway
}

module "apigateway_resource_auth" {
  source        = "./terraform/apigateway-resource-auth"
  depends_on    = [module.tables_dynamodb, module.apigateway, module.apigateway_resource_authorization]
  api_id        = module.apigateway.api_id                               # < output of module.api_gateway
  authorizer_id = module.apigateway_resource_authorization.authorizer_id # < output of module.apigateway_resource_authorization
}

module "apigateway_resource_users" {
  source        = "./terraform/apigateway-resource-users"
  depends_on    = [module.tables_dynamodb, module.apigateway, module.apigateway_resource_authorization]
  api_id        = module.apigateway.api_id                               # < output of module.api_gateway
  authorizer_id = module.apigateway_resource_authorization.authorizer_id # < output of module.apigateway_resource_authorization
}

module "apigateway_resource_contents" {
  source        = "./terraform/apigateway-resource-contents"
  depends_on    = [module.tables_dynamodb, module.apigateway, module.apigateway_resource_authorization]
  api_id        = module.apigateway.api_id                               # < output of module.api_gateway
  authorizer_id = module.apigateway_resource_authorization.authorizer_id # < output of module.apigateway_resource_authorization
}
