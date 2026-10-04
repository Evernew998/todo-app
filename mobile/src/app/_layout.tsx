import { Stack } from 'expo-router'
import { ApolloProvider } from '@apollo/client/react'
import client from '../apolloClient'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import LogoutButton from '@/components/LogoutButton'

function RootNavigator() {
  const { token, isLoading } = useAuth()

  if (isLoading) return null

  const isLoggedIn = token ? true : false

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name='index'
          options={{
            title: 'My Tasks',
            headerRight: () => <LogoutButton />,
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name='login' options={{ title: 'Login' }} />
        <Stack.Screen name='signup' options={{ title: 'Sign Up' }} />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ApolloProvider>
  )
}
