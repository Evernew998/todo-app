import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { getToken } from './auth/token'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const authLink = new SetContextLink(({ headers }) => {
  const token = getToken()
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
