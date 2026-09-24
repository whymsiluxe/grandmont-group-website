import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
      fields: [],
    },
    {
      slug: 'services',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'group', type: 'select', options: ['montage', 'ausbau-renovierung', 'objektservice'] },
        { name: 'ownerApproved', type: 'checkbox', defaultValue: false, label: 'Owner approved (SERVICE_MATRIX)' },
        { name: 'excerpt', type: 'textarea', localized: true },
        { name: 'body', type: 'richText', localized: true },
      ],
    },
    {
      slug: 'portfolio',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'city', type: 'text' },
        { name: 'service', type: 'relationship', relationTo: 'services' },
        { name: 'duration', type: 'text' },
        { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
        { name: 'challenge', type: 'textarea', localized: true },
        { name: 'solution', type: 'textarea', localized: true },
        { name: 'result', type: 'textarea', localized: true },
      ],
    },
    {
      slug: 'faq',
      admin: { useAsTitle: 'question' },
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'richText', localized: true },
        { name: 'relatedService', type: 'relationship', relationTo: 'services' },
      ],
    },
    {
      slug: 'ratgeber',
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'body', type: 'richText', localized: true },
        { name: 'seoDescription', type: 'textarea', localized: true },
      ],
    },
    {
      slug: 'media',
      upload: true,
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
