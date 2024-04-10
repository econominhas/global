/**
 * Helpful references:
 * - https://bobbyhadz.com/blog/aws-cdk-rds-example
 * - https://dev.to/chrisgreening/deploying-a-free-tier-relational-database-with-amazon-rds-3jd2
 */

import {
	InstanceClass,
	InstanceSize,
	InstanceType,
	SubnetType,
	type IVpc,
} from "aws-cdk-lib/aws-ec2";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
	DatabaseInstance,
	DatabaseInstanceEngine,
	PostgresEngineVersion,
	Credentials,
} from "aws-cdk-lib/aws-rds";

import { type BaseResourceInput } from "../types";
import { getId } from "../../utils/id";

interface Input extends BaseResourceInput {
	vpc: IVpc;
}

export const createDatabase = ({ stack, id, name, vpc }: Input) => {
	const dbInstance = new DatabaseInstance(
		stack,
		getId({ id, type: "rds", name }),
		{
			vpc,
			vpcSubnets: {
				subnetType: SubnetType.PRIVATE_ISOLATED,
			},
			engine: DatabaseInstanceEngine.postgres({
				version: PostgresEngineVersion.VER_14,
			}),
			instanceType: InstanceType.of(
				InstanceClass.BURSTABLE3,
				InstanceSize.MICRO,
			),
			credentials: Credentials.fromGeneratedSecret("postgres"),
			multiAz: false,
			allocatedStorage: 100,
			maxAllocatedStorage: 120,
			allowMajorVersionUpgrade: false,
			autoMinorVersionUpgrade: true,
			backupRetention: Duration.days(0),
			deleteAutomatedBackups: true,
			removalPolicy: RemovalPolicy.DESTROY,
			deletionProtection: false,
			databaseName: name,
			publiclyAccessible: false,
		},
	);

	return { dbInstance };
};
