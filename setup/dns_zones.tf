# Criando zona DNS econominhas.com.br
module "econominhas" {
  source = "../modules/dns_zones"

  domain_name = var.domain_name
}
