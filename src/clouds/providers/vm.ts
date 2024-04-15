import { type BaseResourceInput } from "../../types/resources";

interface VMTypes {
	vpc: any;
	vm: any;
	dns: any;
}

export interface CreateInput<T extends VMTypes> extends BaseResourceInput {
	vpc: T["vpc"];
	dns: T["dns"];
	subdomain: string;
	/**
	 * Script to run when the VM initialize
	 */
	startupScript: string;
}

export interface CreateOutput<T extends VMTypes> {
	vm: T["vm"];
}

export interface VM<T extends VMTypes> {
	createPublicWithSubdomain: (i: CreateInput<T>) => CreateOutput<T>;
}
