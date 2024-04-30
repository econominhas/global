import { type BaseResourceInput, type BaseResourceType } from "../types";

export interface CreateApiInput<T extends BaseResourceType>
	extends BaseResourceInput {
	vpc: T["vpc"];
	subnets: Array<T["subnet"]>;
	serviceUser: T["user"];
}

export interface CreateApiOutput<T extends BaseResourceType> {}

export interface API<T extends BaseResourceType> {
	createApi: (i: CreateApiInput<T>) => CreateApiOutput<T>;
}
