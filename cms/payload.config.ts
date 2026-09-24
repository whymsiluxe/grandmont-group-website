import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Access } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const publicRead: Access = () => true
const authenticatedOnly: Access = ({ req: { user } }) => Boolean(user)

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
        // Public read only sees rows that already passed the legal gate —
        // enforced in the read hook below, not just at the query layer,
        // so a slug never leaks via direct-ID lookup either.
        read: publicRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      hooks: {
        afterRead: [
          ({ req, doc }) => {
            if (req.user) return doc
            if (doc.status !== 'published' || !doc.ownerApproved || !doc.legalApproved) return null
            return doc
          },
        ],
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
        read: publicRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      hooks: {
        afterRead: [
          ({ req, doc }) => {
            if (req.user) return doc
            if (!doc.published) return null
            return doc
          },
        ],
      },
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'published', type: 'checkbox', defaultValue: false },
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
        read: publicRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      fields: [
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
        read: publicRead,
        create: authenticatedOnly,
        update: authenticatedOnly,
        delete: authenticatedOnly,
      },
      hooks: {
        afterRead: [
          ({ req, doc }) => {
            if (req.user) return doc
            if (!doc.published) return null
            return doc
          },
        ],
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
        read: publicRead,
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
