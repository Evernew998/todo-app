import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useMutation } from '@apollo/client/react'
import { SIGNUP } from '@/graphql/auth'
import { useAuth } from '@/auth/AuthContext'

export default function SignupScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onCompleted: ({ signup }) => signIn(signup.token),
    onError: (error) => console.error('Signup failed:', error.message),
  })

  function handleSubmit() {
    signup({ variables: { email, password } })
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
        autoComplete='new-password'
        secureTextEntry
      />

      <Pressable onPress={handleSubmit} disabled={loading}>
        <Text>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </Pressable>

      {error && <Text>{error.message}</Text>}

      <Link href='/login'>Already have an account? Login</Link>
    </View>
  )
}
