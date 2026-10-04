import { Pressable, Text, StyleSheet } from 'react-native'
import { useApolloClient } from '@apollo/client/react'
import { useAuth } from '@/auth/AuthContext'

export default function LogoutButton() {
  const { signOut } = useAuth()
  const client = useApolloClient()

  async function handleLogout() {
    await signOut()
    await client.clearStore()
  }

  return (
    <Pressable onPress={handleLogout}>
      <Text style={styles.text}>Log out</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  text: { color: '#2563eb', fontSize: 16, fontWeight: '500' },
})
