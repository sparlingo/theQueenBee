import { list } from '@keystone-6/core';
import { 
  checkbox, 
  password, 
  relationship, 
  text, 
  timestamp, 
  select 
} from '@keystone-6/core/fields';
import {document} from '@keystone-6/fields-document'
import { Lists } from '.keystone/types'

export const lists: Lists = {
  User: list({
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } }),
      // Relationships allow us to reference other lists. In this case,
      // we want a user to have many posts, and we are saying that the user
      // should be referencable by the 'author' field of posts.
      // Make sure you read the docs to understand how they work: https://keystonejs.com/docs/guides/relationships#understanding-relationships
      posts: relationship({ ref: 'Post.author', many: true }),
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ['name', 'posts'],
      },
    },
  }),
  // Our second list is the Posts list. We've got a few more fields here
  // so we have all the info we need for displaying posts.
  Post: list({
    fields: {
      title: text(),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: 'draft',
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
  Organization: list({
    fields: {
      name: text({
        validation: {isRequired: true}, 
      }),
      city: text({
        validation: {isRequired: true},
      }),
      country: text({
        validation: {isRequired: true},
      })
    }
  })
};
