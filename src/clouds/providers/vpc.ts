import { type BaseResourceType, type BaseResourceInput } from "../types";

export interface CreateMainInput extends BaseResourceInput {}

export interface CreateMainOutput<T extends BaseResourceType> {
	vpc: T["vpc"];
}

export interface GetMainDataInput extends BaseResourceInput {}

export interface GetMainDataOutput<T extends BaseResourceType> {
	vpc: T["vpc"];
}

export interface GetSubnetsInput<T extends BaseResourceType>
	extends BaseResourceInput {
	vpc: T["vpc"];
	accessibility: "private" | "public";
}

export interface GetSubnetsOutput<T extends BaseResourceType> {
	subnets: Array<T["subnet"]>;
}

export interface VPC<T extends BaseResourceType> {
	createMain: (i: CreateMainInput) => CreateMainOutput<T>;

	getMainData: (i: GetMainDataInput) => GetMainDataOutput<T>;

	getSubnets: (i: GetSubnetsInput<T>) => GetSubnetsOutput<T>;
}
