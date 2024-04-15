import { TerraformStack } from "cdktf";

export abstract class BaseStack extends TerraformStack {
	abstract vpc: any;

	abstract vm: any;

	abstract sqlDb: any;

	abstract dns: any;
}
