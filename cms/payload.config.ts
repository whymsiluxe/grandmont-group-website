import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Access } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const authenticatedOnly: Access = ({ req: { user } }) => Boolean(user)

// Document-level access control via a query constraint, not a post-read
// hook. Payload's own guidance is that access.read should express "which
// rows may this request see" as a where-clause the DB applies — an
// afterRead hook only filters documents *after* they've already been
// fetched, which is the wrong layer for a publication gate (and doesn't
// help query performance/pagination counts either). Authenticated admin
// users see everything; anonymous requests only see rows matching the
// constraint.
const publishedServiceRead: Access = ({ req: { user } }) => {
  if (user) return true
  return { status: { equals: 'published' }, ownerApproved: { equals: true }, legalApproved: { equals: true } }
}

const publishedFlagRead: Access = ({ req: { user } }) => {
  if (user) return true
  return { published: { equals: true } }
}

const clearedPortfolioRead: Access = ({ req: { user } }) => {
  if (user) return true
  return { published: { equals: true }, clientApproved: { equals: true }, imageRightsCleared: { equals: true } }
}

const localizedText = (name: string, opts: Record<string, unknown> = {}) => ({
  name,
  type: 'text' as const,
  localized: true,
  ...opts,
})

const localizedTextarea = (name: string, opts: Record<string, unknown> = {}) => ({
  name,
  type: 'textarea' as const,
  localized: true,
  ...opts,
})

// Repeatable localized string list (e.g. `included`, `forWhom`, `outcomes`)
// — Payload has no native "array of localized strings" shorthand, so this
// is an array field whose single sub-field is localized.
const localizedStringList = (name: string) => ({
  name,
  type: 'array' as const,
  localized: true,
  fields: [{ name: 'value', type: 'text' as const, required: true }],
})

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  editor: lexicalEditor({}),
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      access: {
        read: authenticatedOnly,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [],
    },
    {
      slug: 'services',
      admin: { useAsTitle: 'slug' },
      access: {
        read: publishedServiceRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'group', type: 'select', required: true, options: ['montage', 'objektservice'] },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: ['draft', 'review', 'published'],
        },
        {
          name: 'ownerApproved',
          type: 'checkbox',
          defaultValue: false,
          label: 'Owner approved (business sign-off)',
        },
        {
          name: 'legalApproved',
          type: 'checkbox',
          defaultValue: false,
          label: 'Legal approved (SERVICE_MATRIX.md gate — Anlage A HwO check)',
        },
        localizedText('eyebrow', { required: true }),
        localizedText('title', { required: true }),
        localizedTextarea('statement', { required: true }),
        localizedStringList('included'),
        localizedTextarea('scopeNote'),
        localizedStringList('forWhom'),
        localizedStringList('outcomes'),
        localizedTextarea('pricing'),
        {
          name: 'faq',
          type: 'array',
          localized: true,
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      slug: 'portfolio',
      admin: { useAsTitle: 'title' },
      access: {
        read: clearedPortfolioRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'published', type: 'checkbox', defaultValue: false },
        {
          name: 'clientApproved',
          type: 'checkbox',
          defaultValue: false,
          label: 'Client approved (written permission for photos/reference text)',
        },
        {
          name: 'imageRightsCleared',
          type: 'checkbox',
          defaultValue: false,
          label: 'Image rights cleared',
        },
        localizedText('title', { required: true }),
        { name: 'city', type: 'text' },
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'duration', type: 'text' },
        { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
        localizedTextarea('challenge'),
        localizedTextarea('solution'),
        localizedTextarea('result'),
      ],
    },
    {
      slug: 'faq',
      admin: { useAsTitle: 'question' },
      access: {
        read: publishedFlagRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: false },
        localizedText('question', { required: true }),
        {
          name: 'answer',
          type: 'textarea',
          localized: true,
          required: true,
        },
        { name: 'relatedService', type: 'relationship', relationTo: 'services' },
      ],
    },
    {
      slug: 'ratgeber',
      admin: { useAsTitle: 'title' },
      access: {
        read: publishedFlagRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'published', type: 'checkbox', defaultValue: false },
        localizedText('title', { required: true }),
        { name: 'body', type: 'richText', localized: true },
        localizedTextarea('seoDescription'),
      ],
    },
    {
      slug: 'media',
      upload: true,
      access: {
        // Media rows are only reachable via an approved services/portfolio
        // relationship in practice, but the collection itself has no
        // publish flag of its own — anonymous read stays open (needed to
        // actually serve the files), write is admin-only.
        read: () => true,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [{ name: 'alt', type: 'text' }],
    },
  ],
  localization: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
