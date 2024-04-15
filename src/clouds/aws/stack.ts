import { provider } from "@cdktf/provider-aws";
import { type Construct } from "constructs";

import { BaseStack } from "../stack";

import { awsDns } from "./providers/dns";
import { awsSqlDb } from "./providers/sql-db";
import { awsVpc } from "./providers/vpc";
import { awsVm } from "./providers/vm";

export class AwsStack extends BaseStack {
	constructor(stack: Construct, id: string) {
		super(stack, id);

		new provider.AwsProvider(stack, id, {
			region: process.env.AWS_ACCOUNT_REGION,
		});
	}

	// Providers

	vpc = awsVpc;

	vm = awsVm;

	sqlDb = awsSqlDb;

	dns = awsDns;
}
