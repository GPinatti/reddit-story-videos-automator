import { S3Client, GetObjectCommand, PutObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3"
import { S3ClientCredentials } from "../entities/s3ClientCredentials";

export class S3Helper {

    client: S3Client

    constructor(region: string, credentials?: S3ClientCredentials) {
        this.client = new S3Client({
            region,
            credentials
        });
    }

    async getS3Object(bucket: string, key: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key
        })

        const data = await this.client.send(command);

        return data
    }

    async putS3Object(bucket: string, key: string, content: any): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: content
        })

        await this.client.send(command);
    }

}