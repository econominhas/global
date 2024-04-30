import { type Construct } from "constructs";

import { AwsStack } from "../../../clouds/aws/stack";

import type * as cdk from "aws-cdk-lib";

export class Stack extends AwsStack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const stack = this;
		const name = __dirname;

		/**
		 * ----------------------------------
		 * Service User for deploy
		 * ----------------------------------
		 */

		const { user } = this.serviceUser.createUser({
			stack,
			id,
			name,
		});

		/**
		 * ----------------------------------
		 * Container Registry for Docker images
		 * ----------------------------------
		 */

		this.containerRegistry.createRegistry({
			stack,
			id,
			name,
			serviceUser: user,
		});
	}
}
