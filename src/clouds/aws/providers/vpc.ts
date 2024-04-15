/**
 * References:
 * https://spacelift.io/blog/terraform-aws-vpc
 */

import {
	vpc as awsVpcTerraform,
	internetGateway,
	routeTable,
	routeTableAssociation,
	subnet as awsSubnetTerraform,
	dataAwsSubnets,
	dataAwsSubnet,
} from "@cdktf/provider-aws";

import { getId } from "../../../utils/id";
import {
	type CreateMainInput,
	type CreateMainOutput,
	type VPC,
	type GetMainDataInput,
	type GetMainDataOutput,
	type GetSubnetsInput,
	type GetSubnetsOutput,
} from "../../providers/vpc";
import { type ResourceTypes } from "../types";

class AWSVPC implements VPC<ResourceTypes> {
	/**
	 * Creates a VPC with the following config:
	 * - The VPC itself
	 * - 2 public subnets in 2 different availability zones
	 * - 2 private subnets in 2 different availability zones
	 * - 1 Internet Gateway to allow inbound and outbound requests from the public subnets
	 * - 2 Route Tables to connect the Internet Gateway to the public subnets
	 */
	createMain({
		stack,
		id,
		name,
	}: CreateMainInput): CreateMainOutput<ResourceTypes> {
		// Vpc

		const { id: vpcId } = this.getMainData({ id, name });
		const vpc = new awsVpcTerraform.Vpc(stack, vpcId, {
			id: vpcId,
			cidrBlock: "10.0.0.0/16",
		});

		// Subnets

		const publicIps = [
			{
				idx: 1,
				ip: "10.0.1.0/24",
				availabilityZone: "a",
			},
			{
				idx: 2,
				ip: "10.0.2.0/24",
				availabilityZone: "b",
			},
		];
		const publicSubnets = publicIps.map(({ ip, idx, availabilityZone }) => {
			const subnetId = getId({
				id,
				name: `${name}${idx}`,
				type: "publicsubnet",
			});
			return new awsSubnetTerraform.Subnet(stack, subnetId, {
				id: subnetId,
				vpcId,
				count: publicIps.length,
				cidrBlock: ip,
				availabilityZone,
				tags: {
					ACCESSIBILITY: "public",
				},
			});
		});

		const privateIps = [
			{
				idx: 1,
				ip: "10.0.4.0/24",
				availabilityZone: "a",
			},
			{
				idx: 2,
				ip: "10.0.5.0/24",
				availabilityZone: "b",
			},
		];
		privateIps.forEach(({ ip, idx, availabilityZone }) => {
			const subnetId = getId({
				id,
				name: `${name}${idx}`,
				type: "privatesubnet",
			});
			new awsSubnetTerraform.Subnet(stack, subnetId, {
				id: subnetId,
				vpcId,
				count: privateIps.length,
				cidrBlock: ip,
				availabilityZone,
				tags: {
					ACCESSIBILITY: "private",
				},
			});
		});

		// Internet Gateway

		const igwId = getId({
			id,
			name,
			type: "igw",
		});
		const igw = new internetGateway.InternetGateway(stack, igwId, {
			id: igwId,
			vpcId,
		});

		// Route Table

		const rtId = getId({
			id,
			name,
			type: "rt",
		});
		new routeTable.RouteTable(stack, rtId, {
			id: rtId,
			vpcId,
			route: [
				{
					cidrBlock: "0.0.0.0/0",
					gatewayId: igw.id,
				},
			],
		});

		// Route Tables Associations

		publicSubnets.forEach(subnet => {
			const rtaId = getId({
				id,
				name,
				type: "rta",
			});
			new routeTableAssociation.RouteTableAssociation(stack, rtaId, {
				id: rtaId,
				count: 3,
				subnetId: subnet.id,
				routeTableId: rtId,
			});
		});

		return { vpc };
	}

	getMainData({ id, name }: GetMainDataInput): GetMainDataOutput {
		const vpcId = getId({
			id,
			name,
			type: "vpc",
		});

		return {
			id: vpcId,
			name: vpcId,
		};
	}

	getSubnets({
		stack,
		id,
		name,
		vpc,
		accessibility,
	}: GetSubnetsInput<ResourceTypes>): GetSubnetsOutput<ResourceTypes> {
		const subnetListId = getId({
			id,
			name,
			type: "subnetlistdata",
		});
		const subnetsList = new dataAwsSubnets.DataAwsSubnets(stack, subnetListId, {
			id: subnetListId,
			filter: [
				{
					name: "vpc-id",
					values: [vpc.id],
				},
				{
					name: "tag:ACCESSIBILITY",
					values: [accessibility],
				},
			],
		});

		const subnets = subnetsList.ids.map(subnetId => {
			const subnetDataId = getId({
				id,
				name,
				type: "subnetdata",
			});
			return new dataAwsSubnet.DataAwsSubnet(stack, subnetDataId, {
				id: subnetId,
				vpcId: vpc.id,
			});
		});

		return { subnets };
	}
}

export const awsVpc = new AWSVPC();
