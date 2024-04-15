import { type BaseResourceInput } from "../../types/resources";

interface DNSTypes {
	dns: any;
}

export interface CreateMainInput extends BaseResourceInput {
	projectId: string;
	ext: ".com.br";
}

export interface CreateMainOutput<T extends DNSTypes> {
	dns: T["dns"];
}

export interface GetMainDataInput extends Omit<BaseResourceInput, "stack"> {
	ext: ".com.br";
}

export interface GetMainDataOutput {
	id: string;
	name: string;
	domainName: string;
}

export interface DNS<T extends DNSTypes> {
	createMain: (i: CreateMainInput) => CreateMainOutput<T>;

	getMainData: (i: GetMainDataInput) => GetMainDataOutput;
}
