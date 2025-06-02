import crypto from 'node:crypto';
import aws4 from 'aws4';

const sleepMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class SpacesClient {
	constructor(settings) {
		this.settings = settings;
		this.url = new URL(settings.baseUrl);
		this.region = this.url.host.split('.')[1];
	}

	getFileUrl = (path) => new URL(path, this.settings.baseUrl).href;

	callAsync = async (options) => {
		const req = aws4.sign({
			...options,
			'host': this.url.host,
			'url': this.getFileUrl(options.path),
			'service': 's3',
			'region': this.region,
		}, this.settings);

		const res = await fetch(req.url, req);

		if (res.status !== 200 && res.status !== 204) {
			console.warn('FETCH ERROR:', 'status=', res.status, 'body=', await res.text());
			throw new Error('Spaces Client Request Failed');
		}
	};

	_uploadAsync = async (body, path, mime) => {
		await this.callAsync({
			'method': 'PUT',
			path,
			body,
			'headers': {
				'Content-Type': mime || 'application/octet-stream',
				'x-amz-acl': 'public-read',
				'x-amz-content-sha256': crypto.createHash('sha256').update(body).digest('hex'),
			},
		});
		return this.getFileUrl(path);
	};

	uploadAsync = async (file, path, mime) => {
		let attempt = 1;
		while (true) { // Try 3 times before throwing the error
			try {
				return await this._uploadAsync(file, path, mime);
			} catch (err) {
				if (attempt > 2) throw err;
				await sleepMs(100);
			} finally {
				attempt++;
			}
		}
	};

	deleteAsync = (path) => this.callAsync({'method': 'DELETE', path});
}

export default SpacesClient;