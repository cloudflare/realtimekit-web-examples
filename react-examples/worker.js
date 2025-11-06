import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  try {
    // Try to serve the requested static asset
    return await getAssetFromKV(event)
  } catch (e) {
    // If not found, fall back to index.html (for React Router / SPA routes)
    return await getAssetFromKV(event, {
      mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
    })
  }
}
