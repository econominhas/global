import { App } from "cdktf";

import { PROJECT_ID } from "../config";

import { Stack } from "./stack";

const id = `${PROJECT_ID}-global`;

const app = new App();
new Stack(app, id);
app.synth();

/**
 *
 * DO NOT USE THIS PROJECT AS BASE FOR ANY OTHER!!!
 *
 * __global is unique and can't be used as reference
 * to create configuration for any other project.
 *
 */
