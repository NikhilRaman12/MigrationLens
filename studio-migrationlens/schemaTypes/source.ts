import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'source',
  title: 'Source',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),

    defineField({
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      options: {
        list: [
          {title: 'Official Documentation', value: 'OFFICIAL_DOCS'},
          {title: 'Release Notes', value: 'RELEASE_NOTES'},
          {title: 'Migration Guide', value: 'MIGRATION_GUIDE'},
          {title: 'API Reference', value: 'API_REFERENCE'},
          {title: 'Security Advisory', value: 'SECURITY_ADVISORY'},
          {title: 'Technical Article', value: 'TECHNICAL_ARTICLE'},
          {title: 'Other', value: 'OTHER'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'authority',
      title: 'Authority',
      type: 'string',
      options: {
        list: [
          {title: 'Primary / Official', value: 'PRIMARY'},
          {title: 'Trusted Secondary', value: 'SECONDARY'},
          {title: 'Community', value: 'COMMUNITY'},
        ],
      },
      initialValue: 'PRIMARY',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'version',
      title: 'Referenced Version',
      type: 'string',
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 5,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      publisher: 'publisher',
      type: 'sourceType',
    },

    prepare({title, publisher, type}) {
      return {
        title,
        subtitle: `${publisher ?? 'Unknown'} · ${type ?? 'Source'}`,
      }
    },
  },
})