# Dev Server 404 Fix

## Problem

Running `npm run dev` started the Next.js development server successfully, but the homepage (`GET /`) returned a **404** instead of rendering the page. The server appeared to be running (listening on port 3000), yet subsequent requests would hang indefinitely — `curl` against localhost:3000 never completed.

The terminal output was also flooded with repeated `Watchpack Error (watcher): Error: EMFILE: too many open files, watch` warnings, indicating the OS file descriptor limit was being exceeded by the file watcher.

## Root Cause

A stale `.next` build cache was causing the dev server to enter a broken state. The cached build artifacts were out of sync with the current source files, which led to:

1. The root route (`/`) resolving to a 404 despite `app/page.tsx` existing.
2. The server eventually becoming unresponsive to new requests.

The `EMFILE` (too many open files) errors compounded the issue — Watchpack was unable to set up file watchers correctly, further destabilizing the dev server.

## Fix

1. **Killed the stuck server process** on port 3000.
2. **Deleted the `.next` directory** to clear the stale build cache.
3. **Restarted the dev server** with `npm run dev`.

```bash
rm -rf .next
npm run dev
```

After this, the server compiled fresh and both routes returned 200:

```
✓ Compiled / in 1895ms (1318 modules)
GET / 200 in 2074ms
GET /gallery 200 in 303ms
```

## Prevention

- If the dev server starts returning unexpected 404s, clearing `.next` is a reliable first step.
- To avoid the `EMFILE` errors on macOS, increase the open file limit before running the dev server:

  ```bash
  ulimit -n 10240
  ```
