# Poon Spaces

Small DigitalOcean Spaces client for Meteor server code. It supports uploading buffers and deleting objects.

## Usage

```bash
meteor add poon-spaces
```

```javascript
import SpacesClient from 'meteor/poon-spaces';

const spaces = new SpacesClient({
	'baseUrl': 'https://example.nyc3.digitaloceanspaces.com',
	'accessKeyId': 'example',
	'secretAccessKey': 'example',
});

await spaces.uploadAsync(buffer, '/example.jpg', 'image/jpeg');
await spaces.deleteAsync('/example.jpg');
```
