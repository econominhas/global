import { type Construct } from "constructs";

import { AwsStack } from "../../../clouds/aws/stack";
import { PROJECT_ID } from "../config";

import type * as cdk from "aws-cdk-lib";

export class Stack extends AwsStack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const stack = this;
		const name = PROJECT_ID;

		/**
		 * ----------------------------------
		 * Route53
		 * ----------------------------------
		 */

		// Main domain for Brazil
		this.dns.createMain({
			stack,
			id,
			name,
			ext: ".com.br",
		});

		/**
		 * ----------------------------------
		 * VPC
		 * ----------------------------------
		 */

		// Main vpc for the project
		const { vpc } = this.vpc.createMain({
			stack,
			id,
			name,
		});

		/**
		 * ----------------------------------
		 * RDS
		 * ----------------------------------
		 */

		const { subnets } = this.vpc.getSubnets({
			id,
			stack,
			name,
			accessibility: "private",
			vpc,
		});

		// Main SQL database
		this.sqlDb.createMain({
			stack,
			id,
			name,
			vpc,
			subnets,
		});
	}
}
