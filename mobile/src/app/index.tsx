import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_TASKS, ADD_TASK } from '@/graphql/tasks'
import { useState } from 'react'
import TaskItem from '@/components/TaskItem'

export default function TasksScreen() {
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

  function handleSubmit() {
    if (!text.trim()) return

    addTask({ variables: { task: { text, completed: false } } })
    setText('')
  }

  if (loading) return <Text style={styles.message}>Loading...</Text>
  if (error) return <Text style={styles.message}>Error: {error.message}</Text>

  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <TextInput value={text} onChangeText={setText} placeholder='New task' style={styles.input} />
        <Pressable
          onPress={handleSubmit}
          disabled={addLoading}
          style={[styles.addButton, addLoading && styles.buttonDisabled]}
        >
          <Text style={styles.addButtonText}>{addLoading ? 'Adding...' : 'Add Task'}</Text>
        </Pressable>
      </View>
      {addError && <Text style={styles.error}>Couldn't add task: {addError.message}</Text>}

      <FlatList
        data={data?.allTasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { padding: 24, textAlign: 'center', color: '#64748b' },

  addRow: { flexDirection: 'row', gap: 8, padding: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },

  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  empty: { textAlign: 'center', padding: 24, color: '#64748b' },
})
