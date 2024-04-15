/**
 * References:
 * https://developer.hashicorp.com/terraform/tutorials/aws/aws-rds
 * https://spacelift.io/blog/terraform-aws-rds
 * https://dev.to/chrisgreening/deploying-a-free-tier-relational-database-with-amazon-rds-3jd2
 */

import {
	dbInstance,
	dbSubnetGroup as awsDbSubnetGroupTerraform,
} from "@cdktf/provider-aws";

import { getId } from "../../../utils/id";
import {
	type SQLDB,
	type CreateMainInput,
	type CreateMainOutput,
} from "../../providers/sql-db";
import { type ResourceTypes } from "../types";

class AWSSQLDb implements SQLDB<ResourceTypes> {
	createMain({
		stack,
		id,
		name,
		subnets,
	}: CreateMainInput<ResourceTypes>): CreateMainOutput<ResourceTypes> {
		// Rds subnet group

		const dbSubnetGroupId = getId({
			id,
			name,
			type: "dbsubnetgroup",
		});
		const dbSubnetGroup = new awsDbSubnetGroupTerraform.DbSubnetGroup(
			stack,
			dbSubnetGroupId,
			{
				id: dbSubnetGroupId,
				name: dbSubnetGroupId,
				subnetIds: subnets.map(s => s.id),
			},
		);

		// Rds

		const dbId = getId({
			id,
			name,
			type: "db",
		});
		const db = new dbInstance.DbInstance(stack, dbId, {
			id: dbId,
			identifier: dbId,
			instanceClass: "db.t3.micro",
			allocatedStorage: 10,
			engine: "postgres",
			engineVersion: "15.6",
			publiclyAccessible: false,
			skipFinalSnapshot: true,
			storageType: "gp2",

			vpcSecurityGroupIds: [dbSubnetGroup.id],
			dbSubnetGroupName: dbSubnetGroup.name,
		});

		return { db };
	}
}

export const awsSqlDb = new AWSSQLDb();
