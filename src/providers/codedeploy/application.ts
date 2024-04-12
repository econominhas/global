/**
 * Helpful references:
 * - https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html
 */

import { CfnApplication, CfnDeploymentGroup } from "aws-cdk-lib/aws-codedeploy";
import {
	Effect,
	Policy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

import { getId } from "../../utils/id";
import { type BaseResourceInput } from "../types";

interface Input extends BaseResourceInput {}

export const createApplication = ({ stack, name, id }: Input) => {
	const applicationId = getId({
		id,
		type: "application",
		name,
	});

	const application = new CfnApplication(stack, applicationId, {
		applicationName: applicationId,
		computePlatform: "Server",
	});

	const principal = new ServicePrincipal("codedeploy.amazonaws.com");

	const roleId = getId({
		id,
		name,
		type: "deploygroup-role",
	});

	const role = new Role(stack, roleId, {
		roleName: roleId,
		assumedBy: principal,
	});

	const policyId = getId({
		id,
		name,
		type: "deploygroup-policy",
	});

	new Policy(stack, policyId, {
		policyName: policyId,
		roles: [role],
		statements: [
			new PolicyStatement({
				effect: Effect.ALLOW,
				actions: ["sts:AssumeRole"],
				principals: [principal],
			}),
		],
	});

	const deploymentGroup = new CfnDeploymentGroup(
		stack,
		getId({
			id,
			name,
			type: "deploygroup",
		}),
		{
			applicationName: applicationId,
			serviceRoleArn: role.roleArn,
			ec2TagSet: {
				ec2TagSetList: [
					{
						ec2TagGroup: [
							{
								key: "STAGE",
								value: process.env.STAGE,
							},
							{
								key: "PROJECT",
								value: id,
							},
						],
					},
				],
			},
		},
	);

	return { application, deploymentGroup };
};
