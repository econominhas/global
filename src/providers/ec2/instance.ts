/**
 * Helpful references:
 * - https://bobbyhadz.com/blog/aws-cdk-ec2-instance-example
 * - https://dev.to/emmanuelnk/part-3-simple-ec2-instance-awesome-aws-cdk-37ia
 */

import {
	Instance,
	InstanceClass,
	InstanceSize,
	InstanceType,
	MachineImage,
	Peer,
	Port,
	SecurityGroup,
	type IVpc,
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import { type BaseResourceInput } from "../types";
import { getId } from "../../utils/id";

interface Input extends BaseResourceInput {
	port: number;
	vpc: IVpc;
}

export const createInstance = ({ stack, id, name, port, vpc }: Input) => {
	/*
	 * Lets create a role for the instance
	 * You can attach permissions to a role and determine what your
	 * Instance can or can not do
	 */
	const role = new Role(
		stack,
		getId({
			id,
			type: "ec2role",
			name,
		}),
		{ assumedBy: new ServicePrincipal("amazonaws.com") },
	);

	/*
	 * Lets create a security group for our instance
	 * A security group acts as a virtual firewall for your instance to control inbound and outbound traffic.
	 */
	const sgId = getId({
		id,
		type: "sg",
		name,
	});

	const securityGroup = new SecurityGroup(stack, sgId, {
		vpc,
		allowAllOutbound: true, // Will let your instance send outbound traffic
		securityGroupName: sgId,
	});

	// Lets use the security group to allow inbound traffic on specific ports
	securityGroup.addIngressRule(
		Peer.anyIpv4(),
		Port.tcp(22),
		"Allows SSH access from anywhere",
	);
	securityGroup.addIngressRule(
		Peer.anyIpv4(),
		Port.tcp(port),
		"Allows access from specific port",
	);

	const ec2Id = getId({
		id,
		type: "ec2",
		name,
	});

	// Finally lets provision our ec2 instance
	const ec2Instance = new Instance(stack, ec2Id, {
		vpc,
		role,
		securityGroup,
		instanceName: ec2Id,
		instanceType: InstanceType.of(
			// T2.micro has free tier usage in aws
			InstanceClass.T2,
			InstanceSize.MICRO,
		),
		machineImage: MachineImage.genericLinux({
			"us-east-1": "ami-0fc5d935ebf8bc3bc",
		}),
	});

	return {
		ec2Instance,
	};
};
