import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";

import { type BaseStack } from "../stack";

import { AwsVpc } from "./providers/vpc";
import { AwsSqlDb } from "./providers/sql-db";
import { AwsDns } from "./providers/dns";
import { AwsServiceUser } from "./providers/service-user";
import { AwsContainerRegistry } from "./providers/container-registry";

export class AwsStack extends cdk.Stack implements BaseStack {
	vpc: AwsVpc;

	sqlDb: AwsSqlDb;

	dns: AwsDns;

	serviceUser: AwsServiceUser;

	containerRegistry: AwsContainerRegistry;

	constructor(stack: Construct, id: string, props?: cdk.StackProps) {
		super(stack, id, props);

		this.vpc = new AwsVpc();
		this.sqlDb = new AwsSqlDb();
		this.dns = new AwsDns();
		this.serviceUser = new AwsServiceUser();
		this.containerRegistry = new AwsContainerRegistry();
	}
}
