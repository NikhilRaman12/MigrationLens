import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'vendor',
      title: 'Vendor',
      type: 'string',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Cloud', value: 'cloud'},
          {title: 'Database', value: 'database'},
          {title: 'Framework', value: 'framework'},
          {title: 'Language', value: 'language'},
          {title: 'API / SDK', value: 'api-sdk'},
          {title: 'Platform', value: 'platform'},
          {title: 'DevOps', value: 'devops'},
          {title: 'AI / ML', value: 'ai-ml'},
          {title: 'Tool', value: 'tool'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      vendor: 'vendor',
    },
    prepare({title, subtitle, vendor}) {
      return {
        title,
        subtitle: vendor ? `${vendor} · ${subtitle}` : subtitle,
      }
    },
  },
})