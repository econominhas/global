interface Input {
	id: string;
	type: string;
	name: string;
	omitStage?: boolean;
}

const getStage = (omitStage?: boolean) => {
	if (omitStage) {
		return;
	}

	return process.env.STAGE === "prod" ? undefined : process.env.STAGE;
};

export const getId = ({ id, type, name, omitStage }: Input) =>
	[id, getStage(omitStage), name, type].filter(Boolean).join("-");
