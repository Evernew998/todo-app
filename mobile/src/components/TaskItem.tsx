import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useMutation } from '@apollo/client/react'
import { type Task, UPDATE_TASK, DELETE_TASK } from '@/graphql/tasks'

export default function TaskItem({ task }: { task: Task }) {
  const [updateTask, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_TASK, {
    onError: (error) => console.error('Update failed:', error.message),
  })
  const [deleteTask, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_TASK, {
    update: (cache, { data }) => {
      if (!data?.deleteTask) return

      const normalizedId = cache.identify({ __typename: 'Task', id: task.id })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
    onError: (error) => console.error('Delete failed:', error.message),
  })

  const isBusy = updateLoading || deleteLoading

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          onPress={() =>
            updateTask({ variables: { id: task.id, input: { completed: !task.completed } } })
          }
          disabled={isBusy}
          accessibilityRole='checkbox'
          accessibilityState={{ checked: task.completed, disabled: isBusy }}
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <Text style={[styles.text, task.completed && styles.completedText]}>{task.text}</Text>
        <Pressable disabled={isBusy} onPress={() => deleteTask({ variables: { id: task.id } })}>
          <Text style={styles.deleteText}>{deleteLoading ? 'Deleting...' : 'Delete'}</Text>
        </Pressable>
      </View>

      {updateError && <Text style={styles.error}>Couldn't update task: {updateError.message}</Text>}
      {deleteError && <Text style={styles.error}>Couldn't delete task: {deleteError.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, fontSize: 16 },
  deleteText: { color: '#dc2626', fontWeight: '500' },
  error: { color: '#dc2626', marginTop: 4 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: { color: 'white', fontWeight: '700' },
  completedText: { textDecorationLine: 'line-through', color: 'grey' },
})
