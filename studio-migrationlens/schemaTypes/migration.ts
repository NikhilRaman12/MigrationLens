import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'migration',
  title: 'Migration',
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'targetTechnology',
      title: 'Target Technology',
      type: 'reference',
      to: [{type: 'technology'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'targetVersion',
      title: 'Target Version',
      type: 'reference',
      to: [{type: 'technologyVersion'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'migrationType',
      title: 'Migration Type',
      type: 'string',
      options: {
        list: [
          {title: 'Version Upgrade', value: 'VERSION_UPGRADE'},
          {title: 'Cloud Migration', value: 'CLOUD_MIGRATION'},
          {title: 'Database Migration', value: 'DATABASE_MIGRATION'},
          {title: 'Framework Migration', value: 'FRAMEWORK_MIGRATION'},
          {title: 'Platform Migration', value: 'PLATFORM_MIGRATION'},
          {title: 'Tool Migration', value: 'TOOL_MIGRATION'},
          {title: 'API / SDK Migration', value: 'API_SDK_MIGRATION'},
          {title: 'Other', value: 'OTHER'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'migrationSteps',
      title: 'Migration Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
              validation: (Rule) => Rule.required().integer().positive(),
            }),

            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'prerequisite',
              title: 'Prerequisite',
              type: 'string',
            }),

            defineField({
              name: 'validation',
              title: 'Validation',
              type: 'string',
            }),

            defineField({
              name: 'rollback',
              title: 'Rollback',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              order: 'order',
              description: 'description',
            },
            prepare({order, description}) {
              return {
                title: `Step ${order}`,
                subtitle: description,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'validationSteps',
      title: 'Validation Steps',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'rollbackSteps',
      title: 'Rollback Steps',
      type: 'array',
      of: [{type: 'string'}],
    }),

    defineField({
      name: 'riskSummary',
      title: 'Risk Summary',
      type: 'text',
      rows: 5,
    }),
  ],

  preview: {
    select: {
      source: 'sourceTechnology.name',
      sourceVersion: 'sourceVersion.version',
      target: 'targetTechnology.name',
      targetVersion: 'targetVersion.version',
      type: 'migrationType',
    },

    prepare({
      source,
      sourceVersion,
      target,
      targetVersion,
      type,
    }) {
      return {
        title: `${source ?? '?'} ${sourceVersion ?? '?'} → ${target ?? '?'} ${targetVersion ?? '?'}`,
        subtitle: type,
      }
    },
  },
})