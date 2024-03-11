# Módulo para criação de registros DNS

resource "aws_route53_record" "main" {
  zone_id = var.aws_route53_record_zone_id
  name    = var.aws_route53_record_name
  type    = var.aws_route53_record_type
  ttl     = var.aws_route53_record_ttl
  records = var.aws_route53_record_records
}
