import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  const url = new URL(event.request.url)

  try {
    // Try to serve the requested static asset
    return await getAssetFromKV(event)
  } catch (e) {
    if (url.pathname === '/' || url.pathname === '') {
      return await getAssetFromKV(event, {
        mapRequestToAsset: req =>
          new Request(`${new URL(req.url).origin}/index.html`, req),
      })
    }

    // For other paths, don't serve root HTML as a fallback asset
    return new Response('Not found', { status: 404 })
  }
}
