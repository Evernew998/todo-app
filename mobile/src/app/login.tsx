import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '@/graphql/auth'
import { useAuth } from '@/auth/AuthContext'

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => signIn(login.token),
    onError: (error) => console.error('Login failed:', error.message),
  })

  function handleSubmit() {
    login({ variables: { email, password } })
  }

  return (
    <View>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        autoComplete='email'
        keyboardType='email-address'
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        autoCapitalize='none'
        autoComplete='current-password'
        secureTextEntry
      />

      <Pressable onPress={handleSubmit} disabled={loading}>
        <Text>{loading ? 'Logging in...' : 'Log in'}</Text>
      </Pressable>

      {error && <Text>{error.message}</Text>}

      <Link href='/signup'>Need an account? Sign up</Link>
    </View>
  )
}
