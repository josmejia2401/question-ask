variable "env" {
  description = "Ambiente donde será desplegado el componente. dev, qa y pdn"
  type        = string
  validation {
    condition     = contains(["dev", "qa", "pdn"], var.env)
    error_message = "El ambiente no es válido"
  }
  nullable = false
  default  = "dev"
}

variable "app_name" {
  description = "Nombre de la aplicación: (questionask)"
  type        = string
  nullable    = false
  default     = "questionask"
}

variable "tags" {
  description = "Tags para el recurso a crear"
  type        = map(string)
  nullable    = true
  default = {
    app_name = "questionask"
    env       = "dev"
  }
}

variable "api_id" {
  description = "ID de la API Gateway; Viene del main.tf principal"
  type        = string
  nullable    = false
  default     = ""
}

variable "authorizer_id" {
  description = "ID de la authorizer; Viene del main.tf principal"
  type        = string
  nullable    = false
  default     = ""
}