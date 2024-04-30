/*
 * References:
 * https://dev.to/femilawal/creating-an-ecs-cluster-with-cloudformation-54cg
 * https://dev.to/aws-builders/mastering-aws-ecs-with-cloudformation-a-comprehensive-guide-aid
 * https://towardsaws.com/deploying-mern-app-with-ecr-ecs-and-fargate-using-cloudformation-b54c03de707d
 * https://sakyasumedh.medium.com/setup-application-load-balancer-and-point-to-ecs-deploy-to-aws-ecs-fargate-with-load-balancer-4b5f6785e8f
 * https://sakyasumedh.medium.com/deploy-backend-application-to-aws-ecs-with-application-load-balancer-step-by-step-guide-part-3-b8125ca27177
 * https://medium.com/@vladkens/aws-ecs-cluster-on-ec2-with-terraform-2023-fdb9f6b7db07
 * https://medium.com/@sivajyothi.linga/ecs-cluster-with-ec2-launch-type-using-terraform-b5fbf535cb67
 */

import {
	Cluster,
	ContainerImage,
	Ec2TaskDefinition,
	NetworkMode,
	Ec2Service,
	AsgCapacityProvider,
	AppProtocol,
} from "aws-cdk-lib/aws-ecs";
import {
	CfnSecurityGroupIngress,
	InstanceType,
	LaunchTemplate,
	MachineImage,
	SecurityGroup,
	UserData,
} from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";

import { type ResourceTypes } from "../types";
import { getId } from "../../../utils/id";
import {
	type API,
	type CreateApiInput,
	type CreateApiOutput,
} from "../../providers/api";
import { type BaseResourceInput } from "../../types";

interface CreateEcr extends BaseResourceInput {
	serviceUser: ResourceTypes["user"];
}

interface CreateSg extends BaseResourceInput {
	vpc: ResourceTypes["vpc"];
}

interface CreateAsg extends BaseResourceInput {
	vpc: ResourceTypes["vpc"];
	subnets: Array<ResourceTypes["subnet"]>;
	sg: SecurityGroup;
	startupScript: string;
}

interface CreateEcsEc2 extends BaseResourceInput {
	vpc: ResourceTypes["vpc"];
	subnets: Array<ResourceTypes["subnet"]>;
	containerRegistry: ResourceTypes["containerRegistry"];
	sg: SecurityGroup;
	asgCapacityProv: ResourceTypes["asgCapacityProv"];
}

/**
 * This API definition was created for one specific
 * purpose: Reduce costs
 *
 * It only allows 1 task to run on a EC2 machine, is
 * not scalable, secure or indicated to any production
 * environment if you can spend 100$/month to maintain
 * your API.
 *
 * This creates an EC2 machine, an ECS "Kit", that
 * runs a docker container in the EC2 machine, and
 * exposes it port, so we can allow connections to
 * the API using nginx.
 */
export class AwsApi implements API<ResourceTypes> {
	PORT = 3000;

	REGION = process.env.AWS_ACCOUNT_REGION;

	linuxImages = {
		"ap-northeast-1": "ami-f63f6f91",
		"ap-southeast-1": "ami-b4ae1dd7",
		"ap-southeast-2": "ami-fbe9eb98",
		"ca-central-1": "ami-ee58e58a",
		"eu-central-1": "ami-085e8a67",
		"eu-west-1": "ami-95f8d2f3",
		"eu-west-2": "ami-bf9481db",
		"us-east-1": "ami-275ffe31",
		"us-east-2": "ami-62745007",
		"us-west-1": "ami-689bc208",
		"us-west-2": "ami-62d35c02",
	};

	createApi({
		stack,
		id,
		name,
		vpc,
		subnets,
		serviceUser,
	}: CreateApiInput<ResourceTypes>): CreateApiOutput<ResourceTypes> {
		// ECR

		const { containerRegistry } = this.createEcr({
			stack,
			id,
			name,
			serviceUser,
		});

		// Security Group

		const { sg } = this.createSg({
			stack,
			id,
			name,
			vpc,
		});

		// Auto Scaling Group

		const { asgCapacityProv } = this.createAsg({
			id,
			name,
			stack,
			sg,
			startupScript: "",
			vpc,
			subnets,
		});

		// Cluster

		this.createEcsEc2({
			id,
			name,
			stack,
			sg,
			vpc,
			subnets,
			asgCapacityProv,
			containerRegistry,
		});

		return {};
	}

	// Private

	private createEcr({ stack, id, name, serviceUser }: CreateEcr) {
		// Container repository

		const repoId = getId({
			id,
			name,
			type: "repo",
		});
		const containerRegistry = new Repository(stack, repoId, {
			repositoryName: name,
			imageScanOnPush: true,
		});

		// Policy to allow access

		const policyId = getId({
			id,
			name,
			type: "policy",
		});
		new Policy(stack, policyId, {
			policyName: policyId,
			statements: [
				new PolicyStatement({
					sid: "allow-pull-push",
					effect: Effect.ALLOW,
					principals: [serviceUser],
					actions: [
						"ecr:GetDownloadUrlForLayer",
						"ecr:BatchGetImage",
						"ecr:BatchCheckLayerAvailability",
						"ecr:PutImage",
						"ecr:InitiateLayerUpload",
						"ecr:UploadLayerPart",
						"ecr:CompleteLayerUpload",
					],
					resources: [containerRegistry.repositoryArn],
				}),
			],
			users: [serviceUser],
		});

		return { containerRegistry };
	}

	private createSg({ stack, id, name, vpc }: CreateSg) {
		const sgId = getId({
			id,
			name,
			type: "sg",
		});
		const sg = new SecurityGroup(stack, sgId, {
			vpc,
			securityGroupName: sgId,
		});
		const sgiId = getId({
			id,
			name,
			type: "sgi",
		});
		new CfnSecurityGroupIngress(stack, sgiId, {
			ipProtocol: "tcp",
			fromPort: this.PORT,
			toPort: this.PORT,
			cidrIp: "0.0.0.0/0",
			groupId: sg.uniqueId,
		});

		return { sg };
	}

	private createAsg({
		id,
		name,
		stack,
		startupScript,
		vpc,
		sg,
		subnets,
	}: CreateAsg) {
		const launchtemplateId = getId({
			id,
			name,
			type: "launchtemplate",
		});
		const launchTemplate = new LaunchTemplate(stack, launchtemplateId, {
			launchTemplateName: launchtemplateId,
			securityGroup: sg,
			instanceType: new InstanceType("t2.micro"),
			machineImage: MachineImage.genericLinux(this.linuxImages),
			userData: UserData.custom(startupScript),
			associatePublicIpAddress: true,
		});

		const asgId = getId({
			id,
			name,
			type: "asg",
		});
		const asg = new AutoScalingGroup(stack, asgId, {
			vpc,
			vpcSubnets: {
				subnets,
			},
			launchTemplate,
			minCapacity: 1,
			desiredCapacity: 1,
			maxCapacity: 1,
			healthCheck: {
				type: "EC2",
			},
		});

		const capacityprovId = getId({
			id,
			name,
			type: "capacityprov",
		});
		const asgCapacityProv = new AsgCapacityProvider(stack, capacityprovId, {
			capacityProviderName: capacityprovId,
			autoScalingGroup: asg,
			enableManagedTerminationProtection: false,
		});

		return {
			asg,
			asgCapacityProv,
		};
	}

	private createEcsEc2({
		stack,
		id,
		name,
		containerRegistry,
		vpc,
		subnets,
		sg,
		asgCapacityProv,
	}: CreateEcsEc2) {
		const clusterId = getId({
			id,
			name,
			type: "cluster",
		});
		const cluster = new Cluster(stack, clusterId, {
			clusterName: clusterId,
			vpc,
		});

		const taskId = getId({
			id,
			name,
			type: "task",
		});
		const task = new Ec2TaskDefinition(stack, taskId, {
			networkMode: NetworkMode.HOST,
			family: taskId,
		});

		const containerId = getId({
			id,
			name,
			type: "container",
		});
		task.addContainer(containerId, {
			containerName: containerId,
			image: ContainerImage.fromEcrRepository(containerRegistry, "latest"),
			essential: true,
			portMappings: [
				{
					appProtocol: AppProtocol.http,
					containerPort: this.PORT,
					hostPort: this.PORT,
				},
			],
			cpu: 0.25,
			command: [],
		});

		const serviceId = getId({
			id,
			name,
			type: "service",
		});
		new Ec2Service(stack, serviceId, {
			serviceName: serviceId,
			cluster,
			taskDefinition: task,
			desiredCount: 1,
			assignPublicIp: false, // May needs to be set to true?
			securityGroups: [sg],
			vpcSubnets: {
				subnets,
			},
			capacityProviderStrategies: [
				{
					capacityProvider: asgCapacityProv.capacityProviderName,
					base: 1,
					weight: 100,
				},
			],
		});
	}
}
