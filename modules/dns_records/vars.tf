variable "aws_route53_record_zone_id" {}
variable "aws_route53_record_name" {}
variable "aws_route53_record_type" {}
variable "aws_route53_record_ttl" {}
variable "aws_route53_record_records" {
  type    = list(string)
  default = []
}
