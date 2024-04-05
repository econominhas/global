import { NsRecord, type PublicHostedZone } from "aws-cdk-lib/aws-route53";

import { type BaseResourceInput } from "../types";
import { getId } from "../utils/id";

interface Input extends BaseResourceInput {
	hostedZone: PublicHostedZone;
	subdomain: string;
}

export const createDnsSubdomain = ({
	stack,
	id,
	hostedZone,
	subdomain,
}: Input) => {
	if (!hostedZone.hostedZoneNameServers) {
		throw new Error('Hosted zone must have "hostedZoneNameServers"');
	}

	const subdomainRecord = new NsRecord(
		stack,
		getId({
			id,
			type: "subdomain",
			name: subdomain,
		}),
		{
			zone: hostedZone,
			values: hostedZone.hostedZoneNameServers,
			recordName: subdomain,
		},
	);

	return {
		subdomainRecord,
	};
};
