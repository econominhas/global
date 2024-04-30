import { type Construct } from "constructs";

export interface BaseResourceType {
	dns: any;
	vpc: any;
	subnet: any;
	sqlDb: any;
	user: any;
	containerRegistry: any;
	containerDistribution: any;
	asgCapacityProv: any;
}

export interface BaseResourceInput {
	stack: Construct;
	id: string;
	name: string;
}
