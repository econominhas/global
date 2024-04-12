#!/usr/bin/env node

import "source-map-support/register";

import { App } from "aws-cdk-lib";

import { PROJECT_ID } from "../config";

import { Stack } from "./stack";

const id = `${PROJECT_ID}-${__dirname}`;

new Stack(new App(), id, {
	tags: {
		STAGE: process.env.STAGE,
		PROJECT: id,
	},
});
