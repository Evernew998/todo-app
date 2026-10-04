import { View, Text, Button, FlatList, TextInput, Pressable } from 'react-native'
import { useQuery, useApolloClient, useMutation } from '@apollo/client/react'
import { GET_TASKS, ADD_TASK } from '@/graphql/tasks'
import { useAuth } from '@/auth/AuthContext'
import { useState } from 'react'

export default function TasksScreen() {
  const { signOut } = useAuth()
  const client = useApolloClient()
  const { data, loading, error } = useQuery(GET_TASKS)
  const [text, setText] = useState('')

  const [addTask, { loading: addLoading, error: addError }] = useMutation(ADD_TASK, {
    update(cache, { data }) {
      const newTask = data?.addTask
      if (!newTask) return

      cache.updateQuery({ query: GET_TASKS }, (existingData) => {
        return {
          allTasks: [...(existingData?.allTasks ?? []), newTask],
        }
      })
    },
  })

  async function handleLogout() {
    await signOut()
    await client.clearStore()
  }

  function handleSubmit() {
    if (!text.trim()) return

    addTask({ variables: { task: { text, completed: false } } })
    setText('')
  }

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  return (
    <View style={{ flex: 1 }}>
      <TextInput value={text} onChangeText={setText} placeholder='New task' />
      <Pressable onPress={handleSubmit} disabled={addLoading}>
        <Text>{addLoading ? 'Adding...' : 'Add Task'}</Text>
      </Pressable>

      {addError && <Text>Couldn't add task: {addError.message}</Text>}

      <FlatList
        data={data?.allTasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        ListEmptyComponent={<Text>No tasks yet</Text>}
      />
      <Button title='Log out' onPress={handleLogout} />
    </View>
  )
}
