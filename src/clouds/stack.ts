import { type DNS } from "./providers/dns";
import { type SQLDB } from "./providers/sql-db";
import { type VPC } from "./providers/vpc";
import { type BaseResourceType } from "./types";
import { type ServiceUser } from "./providers/service-user";
import { type ContainerRegistry } from "./providers/container-registry";
import { type ContainerDistribution } from "./providers/container-distribution";

export abstract class BaseStack {
	abstract vpc: VPC<BaseResourceType>;

	abstract sqlDb: SQLDB<BaseResourceType>;

	abstract dns: DNS<BaseResourceType>;

	abstract serviceUser: ServiceUser<BaseResourceType>;

	abstract containerRegistry: ContainerRegistry<BaseResourceType>;

	abstract containerDistribution: ContainerDistribution<BaseResourceType>;
}
