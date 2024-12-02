import crypto from 'node:crypto';
import aws4 from 'aws4';

const sleepMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SpacesClient {
	constructor(settings) {
		this.settings = settings;
		this.doUrl = new URL(settings.baseUrl);
		this.region = this.doUrl.host.split('.')[1];
	}

	getFileUrl = (path) => new URL(path, this.settings.baseUrl).href;

	callAsync = async (options) => {
		const req = aws4.sign({
			...options,
			'host': this.doUrl.host,
			'url': this.getFileUrl(options.path),
			'service': 's3',
			'region': this.region,
		}, this.settings);
		const res = await fetch(req.url, req);
		if (res.status !== 200) throw 'File upload failed';
	};

	uploadBufferAsync = async (file, path, mime) => {
		await this.callAsync({
			'method': 'PUT',
			'path': path,
			'body': file,
			'headers': {
				'Content-Type': mime || 'application/octet-stream',
				'x-amz-acl': 'public-read',
				'x-amz-content-sha256': crypto.createHash('sha256').update(file).digest('hex'),
			},
		});
		return this.getFileUrl(path);
	};

	retryUploadBufferAsync = async (file, path, mime) => {
		let attempt = 1;
		while (true) { // Try 3 times before throwing the error
			try {
				return await this.uploadBufferAsync(file, path, mime);
			} catch (err) {
				if (attempt > 2) throw err;
				await sleepMs(100);
			} finally {
				attempt++;
			}
		}
	};
}

export default SpacesClient;