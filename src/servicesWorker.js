self.addEventListener('fetch', (event) => {

	const url = new URL(event.request.url);

	if (event.request.method === 'POST' && url.pathname === '/' && url.searchParams.has('share-target')) {
		event.respondWith(Response.redirect('/?receiving-file-share=1'));

		event.waitUntil(async function () {
			const client = await self.clients.get(event.resultingClientId);
			const data = await event.request.formData();
			const files = data.get('file');
			client.postMessage({ files });
		}());
		return;
	}
});
