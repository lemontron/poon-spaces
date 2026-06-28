Package.describe({
	name: 'poon-spaces',
	version: '1.0.0',
	summary: 'DigitalOcean Spaces client for Poon apps',
});

Npm.depends({
	aws4: '1.13.2',
});

Package.onUse(api => {
	api.use('ecmascript', 'server');
	api.use('modules', 'server');
	api.mainModule('index.js', 'server');
});
