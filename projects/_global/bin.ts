#!/usr/bin/env node

import "source-map-support/register";

import { App } from "aws-cdk-lib";

import { Stack } from "./stack";

new Stack(new App(), "global");

/**
 *
 * DO NOT USE THIS PROJECT AS BASE FOR ANY OTHER!!!
 *
 * __global is unique and can't be used as reference
 * to create configuration for any other project.
 *
 */
