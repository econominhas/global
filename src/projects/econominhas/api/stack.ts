import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";

import { createARecord } from "../../../providers/route53/record";
import { getDns } from "../../../providers/route53/dns";
import { createInstance } from "../../../providers/ec2/instance";
import { PROJECT_ID } from "../config";
import { getVpc } from "../../../providers/ec2/vpc";

export class Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const stack = this;

		/**
		 * ----------------------------------
		 * EC2
		 * ----------------------------------
		 */

		const { vpc } = getVpc({
			stack,
			id,
			name: "main",
		});

		const { ec2Instance } = createInstance({
			stack,
			id,
			name: "api",
			port: 3000,
			vpc,
		});

		/**
		 * ----------------------------------
		 * Route 53
		 * ----------------------------------
		 */

		const { hostedZone } = getDns({
			stack,
			id,
			name: PROJECT_ID,
			ext: ".com.br",
		});

		createARecord({
			stack,
			id,
			hostedZone,
			name: "api",
			target: ec2Instance,
		});

		/**
		 * ----------------------------------
		 * CodeDeploy
		 * ----------------------------------
		 */
	}
}
