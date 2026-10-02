import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'technologyVersion',
  title: 'Technology Version',
  type: 'document',

  fields: [
    defineField({
      name: 'technology',
      title: 'Technology',
      type: 'reference',
      to: [{type: 'technology'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),

    defineField({
      name: 'lifecycleStatus',
      title: 'Lifecycle Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Maintenance', value: 'maintenance'},
          {title: 'Deprecated', value: 'deprecated'},
          {title: 'End of Life', value: 'eol'},
        ],
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'endOfSupport',
      title: 'End of Support',
      type: 'date',
    }),

    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      technology: 'technology.name',
      version: 'version',
      status: 'lifecycleStatus',
    },

    prepare({technology, version, status}) {
      return {
        title: technology
          ? `${technology} ${version}`
          : `Version ${version}`,
        subtitle: status,
      }
    },
  },
})