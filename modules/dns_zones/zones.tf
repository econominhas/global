# Módulo para criação de zonas DNS

resource "aws_route53_zone" "main" {
  name = var.domain_name
}
