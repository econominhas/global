import { App } from "cdktf";

import { PROJECT_ID } from "../config";

import { Stack } from "./stack";

const id = `${PROJECT_ID}-${__dirname}`;

const app = new App();
new Stack(app, id);
app.synth();
