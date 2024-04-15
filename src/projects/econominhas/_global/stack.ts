import { type Construct } from "constructs";

import { PROJECT_ID } from "../config";
import { AwsStack } from "../../../clouds/aws/stack";

export class Stack extends AwsStack {
	constructor(stack: Construct, id: string) {
		super(stack, id);

		/**
		 * ----------------------------------
		 * DNS
		 * ----------------------------------
		 */

		this.dns.createMain({
			stack,
			id,
			name: PROJECT_ID,
			projectId: PROJECT_ID,
			ext: ".com.br",
		});

		/**
		 * ----------------------------------
		 * VPC
		 * ----------------------------------
		 */

		const { vpc } = this.vpc.createMain({
			stack,
			id,
			name: PROJECT_ID,
		});

		/**
		 * ----------------------------------
		 * SQL Database
		 * ----------------------------------
		 */

		const { subnets } = this.vpc.getSubnets({
			stack,
			id,
			name: PROJECT_ID,
			accessibility: "private",
			vpc,
		});

		this.sqlDb.createMain({
			stack,
			id,
			name: PROJECT_ID,
			vpc,
			subnets,
		});
	}
}
