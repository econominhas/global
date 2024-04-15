import { type BaseResourceInput } from "../../types/resources";

interface VPCTypes {
	vpc: any;
	subnet: any;
}

export interface CreateMainInput extends BaseResourceInput {}

export interface CreateMainOutput<T extends VPCTypes> {
	vpc: T["vpc"];
}

export interface GetMainDataInput extends Omit<BaseResourceInput, "stack"> {}

export interface GetMainDataOutput {
	id: string;
	name: string;
}

export interface GetSubnetsInput<T extends VPCTypes> extends BaseResourceInput {
	vpc: T["vpc"];
	accessibility: "private" | "public";
}

export interface GetSubnetsOutput<T extends VPCTypes> {
	subnets: Array<T["subnet"]>;
}

export interface VPC<T extends VPCTypes> {
	createMain: (i: CreateMainInput) => CreateMainOutput<T>;

	getMainData: (i: GetMainDataInput) => GetMainDataOutput;

	getSubnets: (i: GetSubnetsInput<T>) => GetSubnetsOutput<T>;
}
