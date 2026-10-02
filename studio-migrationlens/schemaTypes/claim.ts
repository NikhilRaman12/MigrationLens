import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'claim',
  title: 'Claim',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribute',
      title: 'Attribute',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appliesToVersion',
      title: 'Applies To Version',
      type: 'reference',
      to: [{type: 'technologyVersion'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'effectiveFrom',
      title: 'Effective From',
      type: 'date',
    }),
    defineField({
      name: 'effectiveUntil',
      title: 'Effective Until',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'reference',
      to: [{type: 'source'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'supersedes',
      title: 'Supersedes',
      type: 'reference',
      to: [{type: 'claim'}],
    }),
    defineField({
      name: 'contradicts',
      title: 'Contradicts',
      type: 'reference',
      to: [{type: 'claim'}],
    }),
    defineField({
      name: 'confidence',
      title: 'Confidence',
      type: 'string',
      options: {
        list: [
          {title: 'High', value: 'HIGH'},
          {title: 'Medium', value: 'MEDIUM'},
          {title: 'Low', value: 'LOW'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      subject: 'subject',
      attribute: 'attribute',
      versionTitle: 'appliesToVersion.version',
      sourceTitle: 'source.title',
      confidence: 'confidence',
    },
    prepare(selection) {
      const {subject, attribute, versionTitle, sourceTitle, confidence} = selection
      
      const versionStr = versionTitle || 'Unknown Version'
      const title = `${subject || 'Unknown'} - ${attribute || 'Unknown'} (${versionStr})`
      
      const sourceStr = sourceTitle || 'Unknown Source'
      const subtitle = `Source: ${sourceStr} | Confidence: ${confidence || 'Not Set'}`
      
      return {
        title: title,
        subtitle: subtitle,
      }
    },
  },
})
