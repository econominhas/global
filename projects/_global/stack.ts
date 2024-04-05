import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";

import { createDns } from "../../common/route53/dns";

export class Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		createDns({
			stack: this,
			id,
			name: "econominhas",
			domain: "econominhas.com.br",
		});
	}
}
