#!/usr/bin/env node

import "source-map-support/register";

import { App } from "aws-cdk-lib";

import { PROJECT_ID } from "../config";

import { Stack } from "./stack";

new Stack(new App(), `${PROJECT_ID}-${__dirname}`);
