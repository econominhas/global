/*
 * References
 * https://spacelift.io/blog/terraform-ec2-instance
 * https://medium.com/@aishwaryashelke88/a-beginners-guide-to-creating-aws-route-53-record-with-terraform-b40478cde1bb
 */

import { instance, route53Record } from "@cdktf/provider-aws";

import { getId } from "../../../utils/id";
import {
	type VM,
	type CreateInput,
	type CreateOutput,
} from "../../providers/vm";
import { type ResourceTypes } from "../types";

class AWSVM implements VM<ResourceTypes> {
	createPublicWithSubdomain({
		stack,
		id,
		name,

		subdomain,
		dns,
	}: CreateInput<ResourceTypes>): CreateOutput<ResourceTypes> {
		const vmId = getId({
			id,
			name,
			type: "vm",
		});
		const vm = new instance.Instance(stack, vmId, {
			id: vmId,
			instanceType: "t2.micro",
			ami: "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*",
		});

		const recordId = getId({
			id,
			name,
			type: "record",
		});
		new route53Record.Route53Record(stack, recordId, {
			id: recordId,
			name: recordId,
			zoneId: dns.id,
			type: "A",
			alias: {
				name: subdomain,
				zoneId: dns.id,
				evaluateTargetHealth: true,
			},
		});

		return { vm };
	}
}

export const awsVm = new AWSVM();
