import { type IVpc, type ISubnet } from "aws-cdk-lib/aws-ec2";
import { type DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { type User } from "aws-cdk-lib/aws-iam";
import { type PublicHostedZone } from "aws-cdk-lib/aws-route53";
import { type Repository } from "aws-cdk-lib/aws-ecr";
import { type Cluster, type AsgCapacityProvider } from "aws-cdk-lib/aws-ecs";

import { type BaseResourceType } from "../types";

export abstract class ResourceTypes implements BaseResourceType {
	vpc: IVpc;

	subnet: ISubnet;

	sqlDb: DatabaseInstance;

	dns: PublicHostedZone;

	user: User;

	containerRegistry: Repository;

	containerDistribution: Cluster;

	asgCapacityProv: AsgCapacityProvider;
}
