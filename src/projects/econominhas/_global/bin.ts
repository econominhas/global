#!/usr/bin/env node

import "source-map-support/register";

import { App } from "aws-cdk-lib";

import { PROJECT_ID } from "../config";

import { Stack } from "./stack";

const id = `${PROJECT_ID}-global`;

new Stack(new App(), id, {
	tags: {
		STAGE: process.env.STAGE,
		PROJECT: id,
	},
});

/**
 *
 * DO NOT USE THIS PROJECT AS BASE FOR ANY OTHER!!!
 *
 * __global is unique and can't be used as reference
 * to create configuration for any other project.
 *
 */
