import path from 'path';
import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import { Request } from 'express';

interface IUploadConfig {
	driver: 's3' | 'disk';
	tmpFolder: string;
	uploadFolder: string;
	multer: {
		storage: StorageEngine;
	};
	config: {
		disk: {};
		aws: {
			bucket: string;
		};
	};
}

export const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
export default {
	driver: process.env.STORAGE_DRIVER || 'disk',

	tmpFolder,
	uploadFolder: path.resolve(tmpFolder, 'uploads'),

	multer: {
		storage: multer.diskStorage({
			destination: tmpFolder,
			filename: (request: Request, file, callback) => {
				const fileHash = crypto.randomBytes(10).toString('HEX');
				const fileName = `${fileHash}-${file.originalname}`;

				return callback(null, fileName);
			},
		}),
	},

	config: {
		disk: {},
		aws: {
			bucket: process.env.AWS_BUCKET,
		},
	},
} as IUploadConfig;
