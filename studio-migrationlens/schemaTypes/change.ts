import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'change',
  title: 'Change',
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
      name: 'fromVersion',
      title: 'From Version',
      type: 'reference',
      to: [{type: 'technologyVersion'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'toVersion',
      title: 'To Version',
      type: 'reference',
      to: [{type: 'technologyVersion'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Change Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'changeType',
      title: 'Change Type',
      type: 'string',
      options: {
        list: [
          {title: 'Breaking Change', value: 'BREAKING'},
          {title: 'Deprecated', value: 'DEPRECATED'},
          {title: 'Removed', value: 'REMOVED'},
          {title: 'Behavior Change', value: 'BEHAVIOR_CHANGE'},
          {title: 'Security', value: 'SECURITY'},
          {title: 'Compatibility', value: 'COMPATIBILITY'},
          {title: 'Configuration', value: 'CONFIGURATION'},
          {title: 'Performance', value: 'PERFORMANCE'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          {title: 'Low', value: 'LOW'},
          {title: 'Medium', value: 'MEDIUM'},
          {title: 'High', value: 'HIGH'},
          {title: 'Critical', value: 'CRITICAL'},
        ],
      },
      initialValue: 'MEDIUM',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'affectedFeature',
      title: 'Affected Feature',
      type: 'string',
    }),

    defineField({
      name: 'migrationAction',
      title: 'Migration Action',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'validationMethod',
      title: 'Validation Method',
      type: 'text',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      type: 'changeType',
      severity: 'severity',
      from: 'fromVersion.version',
      to: 'toVersion.version',
    },

    prepare({title, type, severity, from, to}) {
      return {
        title,
        subtitle: `${type} · ${severity} · ${from ?? '?'} → ${to ?? '?'}`,
      }
    },
  },
})