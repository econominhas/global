import { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

import { type BaseResourceInput } from "../types";
import { getId } from "../utils/id";

interface DnsInput extends BaseResourceInput {
	name: string;
	domain: string;
}

/**
 * Creates a DNS zone with it's ssl certificate
 */
export const createDns = ({ stack, id, name, domain }: DnsInput) => {
	const trueId = getId({
		id,
		type: "dns",
		name,
		omitStage: true, // Root domains should never have stages
	});

	const hostedZone = new PublicHostedZone(stack, trueId, {
		zoneName: domain,
		caaAmazon: true,
	});

	const certificate = new Certificate(stack, trueId, {
		domainName: domain,
		subjectAlternativeNames: [`*.${domain}`],
		validation: CertificateValidation.fromDns(hostedZone),
	});

	return {
		hostedZone,
		certificate,
	};
};

export const getDns = ({ stack, id, name, domain }: DnsInput) => {
	const trueId = getId({
		id,
		type: "dns",
		name,
		omitStage: true, // Root domains should never have stages
	});

	const hostedZone = PublicHostedZone.fromLookup(stack, trueId, {
		domainName: domain,
	});

	return { hostedZone: hostedZone as PublicHostedZone };
};
