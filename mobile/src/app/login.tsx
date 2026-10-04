import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
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
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        autoComplete='email'
        keyboardType='email-address'
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        autoCapitalize='none'
        autoComplete='current-password'
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error.message}</Text>}

      <Link href='/signup' style={styles.link}>
        Need an account? Sign up
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16 },
})
