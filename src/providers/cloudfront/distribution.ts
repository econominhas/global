import {
	CloudFrontAllowedMethods,
	CloudFrontWebDistribution,
	OriginAccessIdentity,
	SSLMethod,
	SecurityPolicyProtocol,
	ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { type IBucket } from "aws-cdk-lib/aws-s3";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { type ICertificate } from "aws-cdk-lib/aws-certificatemanager";

import { getId } from "../../utils/id";
import { type BaseResourceInput } from "../types";

interface InputS3 extends BaseResourceInput {
	bucket: IBucket;
	fullDomain: string;
	certificate: ICertificate;
}

export const createS3Distribution = ({
	stack,
	name,
	id,
	bucket,
	fullDomain,
	certificate,
}: InputS3) => {
	const viewerCert = ViewerCertificate.fromAcmCertificate(certificate, {
		sslMethod: SSLMethod.SNI,
		securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
		aliases: [fullDomain],
	});

	const cloudfrontOAI = new OriginAccessIdentity(
		stack,
		getId({
			id,
			name,
			type: "oai",
		}),
		{
			comment: `Cloudfront OAI for ${fullDomain}`,
		},
	);

	bucket.addToResourcePolicy(
		new PolicyStatement({
			actions: ["s3:GetObject"],
			resources: [bucket.arnForObjects("*")],
			principals: [
				new CanonicalUserPrincipal(
					cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
				),
			],
		}),
	);

	const distribution = new CloudFrontWebDistribution(
		stack,
		getId({
			id,
			type: "distribution",
			name,
		}),
		{
			viewerCertificate: viewerCert,
			originConfigs: [
				{
					s3OriginSource: {
						s3BucketSource: bucket,
						originAccessIdentity: cloudfrontOAI,
					},
					behaviors: [
						{
							isDefaultBehavior: true,
							compress: true,
							allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
						},
					],
				},
			],
		},
	);

	return { distribution };
};
