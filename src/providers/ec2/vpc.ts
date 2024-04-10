/**
 * Helpful references:
 * - https://bobbyhadz.com/blog/aws-cdk-vpc-example
 */

import { IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

import { type BaseResourceInput } from "../types";
import { getId } from "../../utils/id";

interface Input extends BaseResourceInput {}

export const createVpc = ({ stack, id, name }: Input) => {
	const vpc = new Vpc(
		stack,
		getId({
			id,
			type: "vpc",
			name,
		}),
		{
			ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
			maxAzs: 3,
			subnetConfiguration: [
				{
					name: getId({
						id,
						type: "private-subnet",
						name,
					}),
					subnetType: SubnetType.PRIVATE_WITH_EGRESS,
					cidrMask: 24,
				},
				{
					name: getId({
						id,
						type: "public-subnet",
						name,
					}),
					subnetType: SubnetType.PUBLIC,
					cidrMask: 24,
				},
				{
					name: getId({
						id,
						type: "isolated-subnet",
						name,
					}),
					subnetType: SubnetType.PRIVATE_ISOLATED,
					cidrMask: 28,
				},
			],
		},
	);

	return { vpc };
};

export const getVpc = ({ stack, id, name }: Input) => {
	const vpc = Vpc.fromLookup(
		stack,
		getId({
			id,
			type: "vpc",
			name,
		}),
		{
			vpcId: getId({
				id,
				type: "vpc",
				name,
			}),
		},
	);

	return { vpc };
};
