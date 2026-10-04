import { ApolloProvider } from '@apollo/client/react'
import client from '../apolloClient'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack />
    </ApolloProvider>
  )
}
