import {
	type route53Zone,
	type vpc,
	type dataAwsSubnet,
	type dbInstance,
	type instance,
} from "@cdktf/provider-aws";

import { type BaseResourceType } from "../types";

export abstract class ResourceTypes implements BaseResourceType {
	vpc: vpc.Vpc;

	subnet: dataAwsSubnet.DataAwsSubnet;

	vm: instance.Instance;

	sqlDb: dbInstance.DbInstance;

	dns: route53Zone.Route53Zone;
}
