import { type Construct } from "constructs";

export interface BaseResourceInput {
	stack: Construct;
	id: string;
}
