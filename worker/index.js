self.addEventListener('fetch', event => {

	if (event.request.method === 'POST') {
		event.respondWith((async () => {
			const formData = await event.request.formData();
			let stringedBody = ''
			for (const pair of formData.entries()) {
				stringedBody += `/${pair[0]}, ${pair[1]}`;
			}
			return Response.redirect(`/share-target/${stringedBody}`, 303);
		})());
	}
});
