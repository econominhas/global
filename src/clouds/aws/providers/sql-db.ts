import {
	Credentials,
	DatabaseInstance,
	DatabaseInstanceEngine,
	PostgresEngineVersion,
	StorageType,
	SubnetGroup,
} from "aws-cdk-lib/aws-rds";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
	SubnetType,
	InstanceClass,
	InstanceSize,
	InstanceType,
} from "aws-cdk-lib/aws-ec2";

import { getId } from "../../../utils/id";
import { type ResourceTypes } from "../types";
import {
	type SQLDB,
	type CreateMainInput,
	type CreateMainOutput,
} from "../../providers/sql-db";

export class AwsSqlDb implements SQLDB<ResourceTypes> {
	createMain({
		stack,
		id,
		name,
		vpc,
		subnets,
	}: CreateMainInput<ResourceTypes>): CreateMainOutput<ResourceTypes> {
		const dbId = getId({
			id,
			name,
			type: "sqldb",
			omitStage: true, // Main recourses should never have stages
		});

		const sgId = getId({
			id,
			name,
			type: "sg",
			omitStage: true, // Main recourses should never have stages
		});
		const sg = new SubnetGroup(stack, sgId, {
			subnetGroupName: sgId,
			description: `${dbId} subnet group`,
			vpc,
			vpcSubnets: {
				subnets,
			},
		});

		const db = new DatabaseInstance(stack, dbId, {
			vpc,
			vpcSubnets: {
				subnetType: SubnetType.PRIVATE_ISOLATED,
			},
			engine: DatabaseInstanceEngine.postgres({
				version: PostgresEngineVersion.VER_15,
			}),
			instanceType: InstanceType.of(
				InstanceClass.BURSTABLE3,
				InstanceSize.MICRO,
			),
			credentials: Credentials.fromGeneratedSecret("postgres"),
			multiAz: false,
			allocatedStorage: 20,
			maxAllocatedStorage: 120,
			allowMajorVersionUpgrade: false,
			autoMinorVersionUpgrade: true,
			backupRetention: Duration.days(0),
			deleteAutomatedBackups: true,
			removalPolicy: RemovalPolicy.DESTROY,
			deletionProtection: false,
			databaseName: name,
			publiclyAccessible: false,
			storageEncrypted: true,
			storageType: StorageType.GP2,
			subnetGroup: sg,
		});

		return { db };
	}
}
