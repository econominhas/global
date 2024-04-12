import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";

import { createDns } from "../../../providers/route53/dns";
import { createDatabase } from "../../../providers/rds/database";
import { PROJECT_ID } from "../config";
import { createVpc } from "../../../providers/ec2/vpc";

export class Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const stack = this;

		/**
		 * ----------------------------------
		 * Route53
		 * ----------------------------------
		 */

		// Main domain for Brazil
		createDns({
			stack,
			id,
			name: PROJECT_ID,
			ext: ".com.br",
		});

		/**
		 * ----------------------------------
		 * VPC
		 * ----------------------------------
		 */

		// Main vpc for the project
		const { vpc } = createVpc({
			stack,
			id,
			name: "main",
		});

		/**
		 * ----------------------------------
		 * RDS
		 * ----------------------------------
		 */

		// Main SQL database
		createDatabase({
			stack,
			id,
			name: PROJECT_ID,
			vpc,
		});
	}
}
