declare global {
	namespace NodeJS {
		interface ProcessEnv {
			STAGE: "dev" | "prod";

			// Aws
			AWS_ACCOUNT_NUMBER: string;
			AWS_ACCOUNT_REGION: string;

			// Gcp
			GCP_REGION: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// Convert it into a module by adding an empty export statement.
export {};
