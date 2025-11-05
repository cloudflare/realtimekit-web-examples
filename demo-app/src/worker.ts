interface Env {
	ASSETS: {
		fetch: (request: Request) => Promise<Response>;
	};
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		
		// Try to serve the static asset
		const asset = await env.ASSETS.fetch(request);
		
		// If asset exists (e.g., JS, CSS, images), return it
		if (asset.status !== 404) {
			return asset;
		}
		
		// For all other routes (404s), serve index.html for client-side routing
		const indexRequest = new Request(new URL('/', url), request);
		return env.ASSETS.fetch(indexRequest);
	},
};
