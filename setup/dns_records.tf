# Criando registro www
module "www_econominhas_com_br" {
  source = "../modules/dns_records"

  aws_route53_record_zone_id = module.econominhas.zone_id
  aws_route53_record_name    = "www"
  aws_route53_record_type    = "CNAME"
  aws_route53_record_ttl     = 30
  aws_route53_record_records = ["${var.domain_name}"]
}

# Criando registro api.econominhas.com.br
module "api_econominhas_com_br" {
  source = "../modules/dns_records"

  aws_route53_record_zone_id = module.econominhas.zone_id
  aws_route53_record_name    = "api"
  aws_route53_record_type    = "A"
  aws_route53_record_ttl     = 30
  aws_route53_record_records = [] # IP da máquina na qual estará hospedada a API
}
