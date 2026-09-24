import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this directory. Without this, Next.js
  // infers the root by walking up for a lockfile and can land on the
  // parent monorepo checkout (which has its own package-lock.json and a
  // sibling src/proxy.ts) — that made this build pick up the main site's
  // middleware file and fail with "Module not found: @/i18n/config" in
  // CI, where both projects are checked out side by side. Doesn't
  // reproduce standalone on the VPS because cms/ lives in its own
  // separate git clone there, with no sibling site/ directory.
  turbopack: {
    root: dirname,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
