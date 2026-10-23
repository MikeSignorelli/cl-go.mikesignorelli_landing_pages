# Leads webhook proxy (separate Supabase project)

Deployed to the `go.mikesignorelli.com` Supabase project (ref `gprrntuvxyzyjbwgqwce`),
**not** the project configured in `supabase/config.toml` (ref `dnhvlilceqasarkovoht`,
which this repo's CLI setup targets but has no working deployment credentials).

This function exists so lead-capture forms can POST from the browser to our own
Supabase domain instead of directly to `hooks.zapier.com`. Ad blockers that
target Zapier's domain can't drop a request to our own `.supabase.co` URL. The
real per-page Zapier webhook URLs are kept as edge function secrets and never
reach the client bundle.

Deployed via the Supabase dashboard's function editor (not the CLI, since no
CLI/MCP credentials are available for this project). To update it, paste the
contents of `submit-lead/index.ts` into the dashboard editor at
`https://supabase.com/dashboard/project/gprrntuvxyzyjbwgqwce/functions/submit-lead/code`
and redeploy.

Secrets configured on that project (Edge Functions → Secrets):
- `ZAPIER_FIVEFOLD_WEBHOOK_URL` — five-fold-gift page's Zapier Catch Hook URL

To route another page through this proxy: add a `pagekey: "SECRET_ENV_NAME"`
entry to `WEBHOOK_ENV` in `submit-lead/index.ts`, add the matching secret on
the dashboard, redeploy, then call `sendToZapierViaEdge(pageName, formType,
fields, "pagekey")` from `src/lib/sendToZapier.ts` in the app.

Client env vars (`.env.local` / Vercel):
- `VITE_LEADS_SUPABASE_URL` = `https://gprrntuvxyzyjbwgqwce.supabase.co`
- `VITE_LEADS_SUPABASE_PUBLISHABLE_KEY` — this project's publishable key
  (safe to ship in the client bundle, same tier as a legacy anon key)
