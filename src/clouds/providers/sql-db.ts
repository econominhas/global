import { type BaseResourceInput } from "../../types/resources";

interface SQLDBTypes {
	vpc: any;
	sqlDb: any;
	subnet: any;
}

export interface CreateMainInput<T extends SQLDBTypes>
	extends BaseResourceInput {
	vpc: T["vpc"];
	subnets: Array<T["subnet"]>;
}

export interface CreateMainOutput<T extends SQLDBTypes> {
	db: T["sqlDb"];
}

export interface SQLDB<T extends SQLDBTypes> {
	createMain: (i: CreateMainInput<T>) => CreateMainOutput<T>;
}
