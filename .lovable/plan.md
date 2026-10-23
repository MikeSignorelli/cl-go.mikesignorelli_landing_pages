

## Fix Zapier Webhook Field Capture

**Problem**: Zapier "Catch Hook" doesn't reliably parse `navigator.sendBeacon` + multipart `FormData`. Fields arrive empty.

**Root cause**: NOT the domain change. It's the transport format in `src/lib/zapier.ts`.

**Fix** (single file: `src/lib/zapier.ts`):
1. Remove `navigator.sendBeacon` entirely
2. Switch to `fetch` with `Content-Type: application/json` and `JSON.stringify` body
3. Keep `mode: "no-cors"` (required for cross-origin)
4. Send clean, single-key payload:
   - `First Name`, `Last Name`, `Email Address`, `Phone Number`, `How many travelers in your party?`, `Questions`, `Form Source`, `Timestamp`, `Page URL`
5. Redirect to thank-you page only after fetch completes (in `finally` block)

**Important**: After deploying, you must go into Zapier and click "Test trigger" on your Catch Hook step to pick up the new field schema. Old cached samples won't update automatically.

**Why JSON + no-cors works**: With `no-cors`, the browser sends the request as "opaque" - you won't get a readable response, but Zapier still receives and parses the JSON body. This is the most reliable format for Zapier Catch Hooks.

