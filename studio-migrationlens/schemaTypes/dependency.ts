import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dependency',
  title: 'Dependency',
  type: 'document',

  fields: [
    defineField({
      name: 'sourceTechnology',
      title: 'Source Technology',
      type: 'reference',
      to: [{type: 'technology'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'sourceVersion',
      title: 'Source Version',
      type: 'reference',
      to: [{type: 'technologyVersion'}],
    }),

    defineField({
      name: 'targetTechnology',
      title: 'Target Technology',
      type: 'reference',
      to: [{type: 'technology'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'requiredVersion',
      title: 'Required Target Version',
      type: 'string',
    }),

    defineField({
      name: 'relationship',
      title: 'Relationship',
      type: 'string',
      options: {
        list: [
          {title: 'Requires', value: 'REQUIRES'},
          {title: 'Compatible With', value: 'COMPATIBLE_WITH'},
          {title: 'Incompatible With', value: 'INCOMPATIBLE_WITH'},
          {title: 'Recommends', value: 'RECOMMENDS'},
          {title: 'Conflicts With', value: 'CONFLICTS_WITH'},
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      source: 'sourceTechnology.name',
      target: 'targetTechnology.name',
      relationship: 'relationship',
      requiredVersion: 'requiredVersion',
    },

    prepare({source, target, relationship, requiredVersion}) {
      return {
        title: `${source ?? 'Unknown'} → ${target ?? 'Unknown'}`,
        subtitle: requiredVersion
          ? `${relationship} · ${requiredVersion}`
          : relationship,
      }
    },
  },
})