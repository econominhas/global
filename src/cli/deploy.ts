/* eslint-disable no-console */

import { readdirSync } from "fs";
import { join } from "path";

import inquirer from "inquirer";

const deploy = async () => {
	const projects = readdirSync(join(process.cwd(), "src", "projects"));

	const { project } = await inquirer.prompt([
		{
			type: "list",
			name: "project",
			message: "Select the project",
			choices: projects,
		},
	]);

	const repositories = readdirSync(
		join(process.cwd(), "src", "projects", project),
	).filter(dirName => !dirName.includes("."));

	const { repository } = await inquirer.prompt([
		{
			type: "list",
			name: "repository",
			message: "Select the repository",
			choices: repositories,
		},
	]);

	console.log("Please, run the following command:");
	console.log(
		`cdk deploy --app="ts-node --prefer-ts-exts ./src/projects/${project}/${repository}/bin.ts"`,
	);
};

deploy();
