import fs from 'fs';
import path from 'path';

import uploadCOnfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
	public async saveFile(file: string): Promise<string> {
		fs.promises.rename(
			path.resolve(uploadCOnfig.tmpFolder, file),
			path.resolve(uploadCOnfig.uploadFolder, file),
		);

		return file;
	}

	public async deleteFile(file: string): Promise<void> {
		const filePath = path.resolve(uploadCOnfig.uploadFolder, file);

		try {
			await fs.promises.stat(filePath);
		} catch (err) {
			return;
		}

		await fs.promises.unlink(filePath);
	}
}
