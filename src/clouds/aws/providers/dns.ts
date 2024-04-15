/**
 * References:
 * https://medium.com/@maxbeatty/using-terraform-to-manage-dns-records-b338f42b50dc
 * https://www.grailbox.com/2020/04/how-to-set-up-a-domain-in-amazon-route-53-with-terraform/
 */

import {
	acmCertificate,
	acmCertificateValidation,
	route53Record,
	route53Zone,
} from "@cdktf/provider-aws";

import { getId } from "../../../utils/id";
import {
	type DNS,
	type CreateMainInput,
	type CreateMainOutput,
	type GetMainDataInput,
	type GetMainDataOutput,
} from "../../providers/dns";
import { type ResourceTypes } from "../types";

class AWSDNS implements DNS<ResourceTypes> {
	createMain({
		stack,
		id,
		name,
		ext,
	}: CreateMainInput): CreateMainOutput<ResourceTypes> {
		const domainName = `${name}${ext}`;

		// Route53

		const { id: dnsId } = this.getMainData({
			id,
			name,
			ext,
		});
		const dns = new route53Zone.Route53Zone(stack, dnsId, {
			id: dnsId,
			name: domainName,
			forceDestroy: true,
		});

		// Certificate

		const certificateId = getId({
			id,
			name,
			type: "cert",
		});
		const certificate = new acmCertificate.AcmCertificate(
			stack,
			certificateId,
			{
				domainName,
				subjectAlternativeNames: [`*.${domainName}`],
				validationMethod: "DNS",
				lifecycle: {
					createBeforeDestroy: true,
				},
			},
		);

		const caaRecordId = getId({
			id,
			name,
			type: "caarecord",
		});
		new route53Record.Route53Record(stack, caaRecordId, {
			zoneId: dns.id,
			name: domainName,
			type: "CAA",
			records: ['0 issue "amazon.com"', '0 issuewild "amazon.com"'],
			ttl: 300,
		});

		// Validation

		const domainValidationOptions = certificate.domainValidationOptions.get(0);

		const validationId = getId({
			id,
			name,
			type: "validrecord",
		});
		const validRecord = new route53Record.Route53Record(stack, validationId, {
			zoneId: dns.id,
			name: domainValidationOptions.resourceRecordName,
			type: domainValidationOptions.resourceRecordType,
			records: [domainValidationOptions.resourceRecordValue],
			ttl: 300,
		});

		// Wait certificate validation

		const waitValidationId = getId({
			id,
			name,
			type: "certvalid",
		});
		new acmCertificateValidation.AcmCertificateValidation(
			stack,
			waitValidationId,
			{
				certificateArn: certificate.arn,
				validationRecordFqdns: [validRecord.fqdn],
			},
		);

		return { dns };
	}

	getMainData({ id, name, ext }: GetMainDataInput): GetMainDataOutput {
		const dnsId = getId({
			id,
			name,
			type: "dns",
		});

		return {
			id: dnsId,
			name: dnsId,
			domainName: `${name}${ext}`,
		};
	}
}

export const awsDns = new AWSDNS();
