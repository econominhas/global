import { type BaseResourceType, type BaseResourceInput } from "../types";

export interface CreateMainInput<T extends BaseResourceType>
	extends BaseResourceInput {
	vpc: T["vpc"];
	subnets: Array<T["subnet"]>;
}

export interface CreateMainOutput<T extends BaseResourceType> {
	db: T["sqlDb"];
}

export interface SQLDB<T extends BaseResourceType> {
	createMain: (i: CreateMainInput<T>) => CreateMainOutput<T>;
}
