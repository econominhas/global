import { User } from "aws-cdk-lib/aws-iam";

import { type ResourceTypes } from "../types";
import { getId } from "../../../utils/id";
import {
	type ServiceUser,
	type CreateUserInput,
	type CreateUserOutput,
} from "../../providers/service-user";

export class AwsServiceUser implements ServiceUser<ResourceTypes> {
	createUser({
		stack,
		id,
		name,
	}: CreateUserInput): CreateUserOutput<ResourceTypes> {
		const userId = getId({
			id,
			name,
			type: "user",
		});
		const user = new User(stack, userId, {
			userName: userId,
		});

		return { user };
	}
}
