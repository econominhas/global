import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";

import { getId } from "../../utils/id";
import { type BaseResourceInput } from "../types";

interface Input extends BaseResourceInput {}

export const createWebsiteBucket = ({ stack, name, id }: Input) => {
	const trueId = getId({
		id,
		name,
		type: "bucket",
	});

	const bucket = new Bucket(stack, trueId, {
		bucketName: trueId, // Bucket name MUST be the domain name
		websiteIndexDocument: "index.html", // Your sites main page
		websiteErrorDocument: "index.html", // For simplicity
		publicReadAccess: false, // We'll use Cloudfront to access
		blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
	});

	return { bucket };
};
