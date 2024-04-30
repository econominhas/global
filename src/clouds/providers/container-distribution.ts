import { type BaseResourceInput, type BaseResourceType } from "../types";

export interface CreateDistributionInput<T extends BaseResourceType>
	extends BaseResourceInput {
	containerRegistry: T["containerRegistry"];
	vpc: T["vpc"];
	subnets: Array<T["subnet"]>;
}

export interface CreateDistributionOutput<T extends BaseResourceType> {
	containerDistribution: T["containerDistribution"];
}

export interface ContainerDistribution<T extends BaseResourceType> {
	createDistribution: (
		i: CreateDistributionInput<T>,
	) => CreateDistributionOutput<T>;
}
