// Worker to handle SPA routing for all React examples
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try to fetch the requested asset
    let response = await env.ASSETS.fetch(request);

    // If the response is a 404 and the path looks like it's inside an example directory,
    // serve the index.html from that example directory
    if (response.status === 404) {
      // Extract the example name from the path (e.g., /simple-group-call/some-route -> simple-group-call)
      const pathParts = pathname.split('/').filter(part => part !== '');
      
      if (pathParts.length > 0) {
        const exampleName = pathParts[0];
        
        // Try to serve the index.html from the example directory
        const indexUrl = new URL(request.url);
        indexUrl.pathname = `/${exampleName}/index.html`;
        
        const indexRequest = new Request(indexUrl, request);
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        
        // If we found an index.html, serve it with 200 status
        if (indexResponse.status === 200) {
          // Create a new response with the same body but 200 status
          // This allows client-side routing to work properly
          return new Response(indexResponse.body, {
            status: 200,
            headers: indexResponse.headers
          });
        }
      }
    }

    // Return the original response (either success or 404)
    return response;
  }
};
