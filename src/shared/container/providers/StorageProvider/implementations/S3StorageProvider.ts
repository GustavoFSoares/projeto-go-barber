import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';

import uploadCOnfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
	private client: S3;

	private bucketName: string;

	constructor() {
		this.client = new aws.S3({
			region: process.env.AWS_DEFAULT_REGION,
		});
		this.bucketName = process.env.AWS_BUCKET || 'us-est-1';
	}

	public async saveFile(file: string): Promise<string> {
		const originalPath = path.resolve(uploadCOnfig.tmpFolder, file);

		const ContentType = mime.getType(originalPath);
		const fileContent = await fs.promises.readFile(originalPath);

		if (!ContentType) {
			throw new Error('File not found');
		}

		await this.client
			.putObject({
				Bucket: this.bucketName,
				Key: file,
				ACL: 'public-read',
				Body: fileContent,
				ContentType,
			})
			.promise();

		await fs.promises.unlink(originalPath);

		return file;
	}

	public async deleteFile(file: string): Promise<void> {
		await this.client
			.deleteObject({
				Bucket: this.bucketName,
				Key: file,
			})
			.promise();
	}
}
