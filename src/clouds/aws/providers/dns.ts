import { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

import { type ResourceTypes } from "../types";
import {
	type DNS,
	type CreateMainInput,
	type CreateMainOutput,
	type GetMainDataInput,
	type GetMainDataOutput,
} from "../../providers/dns";
import { getId } from "../../../utils/id";

export class AwsDns implements DNS<ResourceTypes> {
	/**
	 * If it's the first time creating a DNS,
	 * you will have to update the DNS record on
	 * the place that you purchased the domain
	 * (Like Hostinger, GoDaddy) during the run
	 * to be able to finish it
	 */
	createMain({
		stack,
		id,
		name,
		ext,
	}: CreateMainInput): CreateMainOutput<ResourceTypes> {
		const domainName = `${name}${ext}`;

		// DNS

		const dnsId = getId({
			id,
			name,
			type: "dns",
			omitStage: true, // Main recourses should never have stages
		});
		const dns = new PublicHostedZone(stack, dnsId, {
			zoneName: dnsId,
			caaAmazon: true,
		});

		// Certificate

		const certId = getId({
			id,
			name,
			type: "cert",
			omitStage: true, // Main recourses should never have stages
		});
		new Certificate(stack, certId, {
			domainName,
			subjectAlternativeNames: [`*.${domainName}`],
			validation: CertificateValidation.fromDns(dns),
		});

		return { dns };
	}

	getMainData({
		stack,
		id,
		name,
		ext,
	}: GetMainDataInput): GetMainDataOutput<ResourceTypes> {
		const dnsId = getId({
			id,
			name,
			type: "dns",
			omitStage: true, // Main recourses should never have stages
		});

		const dns = PublicHostedZone.fromLookup(stack, dnsId, {
			domainName: `${name}${ext}`,
		});

		return { dns };
	}
}
