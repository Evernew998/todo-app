import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './schema.graphql',
  generates: {
    './src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          Task: '../types#Task as TaskModel',
        },
        contextType: '../types#Context',
      },
    },
  },
}

export default config
