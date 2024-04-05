import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";

import { createDnsSubdomain } from "../../common/route53/dns-subdomain";
import { getDns } from "../../common/route53/dns";

export class Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const { hostedZone } = getDns({
			stack: this,
			id,
			name: "econominhas",
			domain: "econominhas.com.br",
		});

		createDnsSubdomain({
			stack: this,
			id,
			hostedZone,
			subdomain: "api",
		});
	}
}
