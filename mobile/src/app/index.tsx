import { View, Text, Button } from 'react-native'
import { useAuth } from '@/auth/AuthContext'

export default function TasksScreen() {
  const { signOut } = useAuth()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Tasks screen (you are logged in)</Text>
      <Button title='Log out' onPress={signOut} />
    </View>
  )
}
