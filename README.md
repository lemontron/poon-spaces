Super simple no frills DigitalOcean Spaces client. Only supports buffers.
It's not a complete client, just a simple one that works.
Feel free to check the source code. There's no build tool or anything, just plain vanilla js.

## Install

```bash
npm install poon-spaces
```

## Usage

```js
const spaces = new SpacesClient({
    "baseUrl": "https://example.nyc3.digitaloceanspaces.com",
    "accessKeyId": "example",
    "secretAccessKey": "example"
});

// In this case, buffer is a jpg image!
await spaces.retryUploadBufferAsync(buffer, '/example.jpg', 'image/jpeg');

// You can also use the no-retry version, but it's probably never used in production
await spaces.uploadBufferAsync(buffer, '/example.jpg', 'image/jpeg');

```