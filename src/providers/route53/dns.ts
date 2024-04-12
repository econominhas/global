import { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

import { type BaseResourceInput } from "../types";
import { getId } from "../../utils/id";

interface DnsInput extends BaseResourceInput {
	ext: ".com.br" | ".com";
}

/**
 * Creates a DNS zone with it's ssl certificate
 */
export const createDns = ({ stack, id, name, ext }: DnsInput) => {
	const domain = `${name}${ext}`;

	const hostedZone = new PublicHostedZone(
		stack,
		getId({
			id,
			type: "hz",
			name,
			omitStage: true, // Root domains should never have stages
		}),
		{
			zoneName: domain,
			caaAmazon: true,
		},
	);

	/**
	 * If it's the first time creating a DNS,
	 * you will have to create it without the certificate:
	 * - Comment the part bellow were the certificate is created
	 * - Add the DNS providers to were you purchased the
	 * domain (Like Hostinger, GoDaddy)
	 * - Uncomment the certificate creation
	 * - Run the CDK again
	 */
	const certificate = new Certificate(
		stack,
		getId({
			id,
			type: "cert",
			name,
			omitStage: true, // Root domains should never have stages
		}),
		{
			domainName: domain,
			subjectAlternativeNames: [`*.${domain}`],
			validation: CertificateValidation.fromDns(hostedZone),
		},
	);

	return {
		hostedZone,
		certificate,
	};
};

export const getDns = ({ stack, id, name, ext }: DnsInput) => {
	const trueId = getId({
		id,
		type: "dns",
		name,
		omitStage: true, // Root domains should never have stages
	});

	const hostedZone = PublicHostedZone.fromLookup(stack, trueId, {
		domainName: `${name}${ext}`,
	});

	return { hostedZone: hostedZone as PublicHostedZone };
};
