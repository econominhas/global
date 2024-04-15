import { readFileSync } from "fs";

import { type Construct } from "constructs";

import { PROJECT_ID } from "../config";
import { AwsStack } from "../../../clouds/aws/stack";

export class Stack extends AwsStack {
	constructor(stack: Construct, id: string) {
		super(stack, id);

		const repository = __dirname;

		/**
		 * ----------------------------------
		 * VM
		 * - exposed to the internet
		 * - with subdomain
		 * ----------------------------------
		 */

		const vpc = this.vpc.getMainData({
			id,
			name: PROJECT_ID,
		});

		const dns = this.dns.getMainData({
			id,
			name: PROJECT_ID,
			ext: ".com.br",
		});

		this.vm.createPublicWithSubdomain({
			stack,
			id,
			name: repository,

			subdomain: repository,
			vpc: vpc as any,
			dns: dns as any,
			startupScript: readFileSync("./startup-script.sh").toString("utf8"),
		});
	}
}
