import { readFileSync } from 'node:fs'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuid } from 'uuid'
import { GraphQLError } from 'graphql/error'
import type { Resolvers } from './generated/graphql'
import { User, PublicUser, Context } from './types'

const typeDefs = readFileSync('./schema.graphql', 'utf-8')

let users: User[] = []

const sessions = new Map<string, string>()

function createSession(userId: string) {
  const token = uuid()
  sessions.set(token, userId)
  return token
}

function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email }
}

function getUserFromToken(token: string | undefined): PublicUser | null {
  if (!token) return null

  const userId = sessions.get(token)
  if (!userId) return null

  const user = users.find((u) => u.id === userId)
  return user ? toPublicUser(user) : null
}

function requireUser(context: Context): PublicUser {
  if (!context.user) {
    throw new GraphQLError('You must be logged in', { extensions: { code: 'UNAUTHENTICATED' } })
  }

  return context.user
}

const resolvers: Resolvers = {
  Query: {
    me: (_parent, _args, context) => {
      return context.user
    },
  },
  Mutation: {
    signup: (_parent, args) => {
      const existing = users.find((u) => u.email === args.email)

      if (existing) {
        throw new GraphQLError('Email already in use', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.email },
        })
      }

      const newUser: User = { id: uuid(), email: args.email, password: args.password }
      users.push(newUser)

      return { token: createSession(newUser.id), user: toPublicUser(newUser) }
    },
    login: (_parent, args) => {
      const user = users.find((u) => u.email === args.email && u.password === args.password)

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      return { token: createSession(user.id), user: toPublicUser(user) }
    },
    logout: (_parent, _args, context) => {
      requireUser(context)
      if (!context.token) {
        return false
      }
      sessions.delete(context.token)
      return true
    },
  },
}

const server = new ApolloServer<Context>({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }): Promise<Context> => {
    const header = req.headers.authorization ?? ''
    const token = header.replace('Bearer ', '')
    return { user: getUserFromToken(token), token: token || null }
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
