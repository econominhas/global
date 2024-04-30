import { type BaseResourceInput, type BaseResourceType } from "../types";

export interface CreateMainInput extends BaseResourceInput {
	ext: ".com.br";
}

export interface CreateMainOutput<T extends BaseResourceType> {
	dns: T["dns"];
}

export interface GetMainDataInput extends BaseResourceInput {
	ext: ".com.br";
}

export interface GetMainDataOutput<T extends BaseResourceType> {
	dns: T["dns"];
}

export interface DNS<T extends BaseResourceType> {
	createMain: (i: CreateMainInput) => CreateMainOutput<T>;

	getMainData: (i: GetMainDataInput) => GetMainDataOutput<T>;
}
