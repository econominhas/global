import {
	ARecord,
	NsRecord,
	type PublicHostedZone,
} from "aws-cdk-lib/aws-route53";
import { type IInstance } from "aws-cdk-lib/aws-ec2";

import { type BaseResourceInput } from "../types";
import { getId } from "../../utils/id";

interface InputCreateARecord extends BaseResourceInput {
	hostedZone: PublicHostedZone;
}

export const createDnsSubdomain = ({
	stack,
	id,
	hostedZone,
	name,
}: InputCreateARecord) => {
	if (!hostedZone.hostedZoneNameServers) {
		throw new Error('Hosted zone must have "hostedZoneNameServers"');
	}

	const subdomainRecord = new NsRecord(
		stack,
		getId({
			id,
			type: "subdomain",
			name,
		}),
		{
			zone: hostedZone,
			values: hostedZone.hostedZoneNameServers,
			recordName: name,
		},
	);

	return {
		subdomainRecord,
	};
};

interface InputCreateARecord extends BaseResourceInput {
	hostedZone: PublicHostedZone;
	target: IInstance;
}

export const createARecord = ({
	stack,
	id,
	hostedZone,
	name,
	target,
}: InputCreateARecord) => {
	if (!hostedZone.hostedZoneNameServers) {
		throw new Error('Hosted zone must have "hostedZoneNameServers"');
	}

	const subdomainRecord = new ARecord(
		stack,
		getId({
			id,
			type: "subdomain",
			name,
		}),
		{
			zone: hostedZone,
			recordName: name,
			target: {
				values: [target.instancePublicIp],
			},
		},
	);

	return {
		subdomainRecord,
	};
};
