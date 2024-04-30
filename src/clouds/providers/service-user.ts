import { type BaseResourceInput, type BaseResourceType } from "../types";

export interface CreateUserInput extends BaseResourceInput {}

export interface CreateUserOutput<T extends BaseResourceType> {
	user: T["user"];
}

export interface ServiceUser<T extends BaseResourceType> {
	createUser: (i: CreateUserInput) => CreateUserOutput<T>;
}
