import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { getToken } from './auth/token'

const httpLink = new HttpLink({
  uri: 'http://192.168.0.6:4000',
})

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allTasks: {
          merge(_existing, incoming) {
            return incoming
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

export default client
