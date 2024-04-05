# Econominhas Infrastructure

This repository is responsible for handling all infrastructure configuration for **all repositories** inside Econominhas organization.

## Why use one repo instead of having each repo with it's own config?

### Pros

- **Safety:** Instead of anyone with the access to the repository having the access to do any changes in the infrastructure, having everything in one repo allow us to give the permissions to only Cloud Architects dedicated to create the best infrastructure.
- **Reusability:** Instead of duplicating the same code over and over again, for every repository that we have, we can create reusable code in this repo, and use it for every project that we need to deploy
- **Updates & Fixes:** Easier to fix issues and update anything that we need.
- **Scope:** Each repository has it's own purpose, for example, an "api" repository already has a lot to worry about, all that business logic, code patterns and stuff. It's not responsibility of the api to know if it has a DNS record or not, this is not related to the problem that the API is trying to solve, so we split it and put it in here: the infrastructure repository.

### Cons

- **Not scalable for really big companies:** There's no way to handle 1000 projects in only one repo.

### Conclusion

As we are a simple startup, with only a few projects and people working on them, the cons of this will not affect us, so we only have pros.

## Folders and files patterns

We have main folders here: `common` and `projects`.

### common

Generic functions exist to be used to create resources.

### projects

Were the real config exists to create the stacks.

Inside this folder, we always follow this pattern:

```
| projects
| -- {repository name}	<- Example: "api"
| -- -- bin.ts 					<- The initializer of the stack
| -- -- stack.ts				<- The stack config
```

We also have the `projects/_global` folder, that has the "global" stack that is used to config things that may be used by all projects.

## Useful commands

- `pnpm run build` compile typescript to js
- `pnpm run watch` watch for changes and compile
- `pnpm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
