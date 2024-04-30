import { IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

import { getId } from "../../../utils/id";
import { type ResourceTypes } from "../types";
import {
	type VPC,
	type CreateMainInput,
	type CreateMainOutput,
	type GetMainDataInput,
	type GetMainDataOutput,
	type GetSubnetsInput,
	type GetSubnetsOutput,
} from "../../providers/vpc";

export class AwsVpc implements VPC<ResourceTypes> {
	createMain({
		stack,
		id,
		name,
	}: CreateMainInput): CreateMainOutput<ResourceTypes> {
		const vpcId = getId({
			id,
			name,
			type: "vpc",
			omitStage: true, // Main recourses should never have stages
		});
		const vpc = new Vpc(stack, vpcId, {
			ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
			maxAzs: 3,
			subnetConfiguration: [
				{
					name: getId({
						id,
						type: "privatesubnet",
						name,
					}),
					subnetType: SubnetType.PRIVATE_ISOLATED,
					cidrMask: 24,
				},
				{
					name: getId({
						id,
						name,
						type: "publicsubnet",
					}),
					subnetType: SubnetType.PUBLIC,
					cidrMask: 24,
				},
			],
		});

		return { vpc };
	}

	getMainData({
		stack,
		id,
		name,
	}: GetMainDataInput): GetMainDataOutput<ResourceTypes> {
		const vpcId = getId({
			id,
			name,
			type: "vpc",
			omitStage: true, // Main recourses should never have stages
		});
		const vpc = Vpc.fromLookup(stack, vpcId, {
			vpcId,
		});

		return { vpc };
	}

	getSubnets({
		vpc,
		accessibility,
	}: GetSubnetsInput<ResourceTypes>): GetSubnetsOutput<ResourceTypes> {
		return {
			subnets:
				accessibility === "private" ? vpc.privateSubnets : vpc.publicSubnets,
		};
	}
}
