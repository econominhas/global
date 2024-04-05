#!/usr/bin/env node

import "source-map-support/register";

import { App } from "aws-cdk-lib";

import { Stack } from "./stack";

new Stack(new App(), __dirname);
