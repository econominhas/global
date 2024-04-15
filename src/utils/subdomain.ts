export const getSubdomain = (subdomain: string) => {
	const prefix = process.env.STAGE === "prod" ? undefined : "dev";

	return [subdomain, prefix].filter(Boolean).join(".");
};
