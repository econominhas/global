interface Input {
	id: string;
	type: string;
	name: string;
	omitStage?: boolean;
}

export const getId = ({ id, type, name, omitStage }: Input) => {
	if (omitStage) {
		return [id, name, type].join("-");
	}

	return [
		id,
		process.env.STAGE === "prod" ? undefined : process.env.STAGE,
		name,
		type,
	]
		.filter(Boolean)
		.join("-");
};
