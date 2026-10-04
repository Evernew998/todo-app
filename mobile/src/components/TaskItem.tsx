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
    <View>
      <Text style={task.completed && styles.completedText}>{task.text}</Text>
      <Pressable
        onPress={() => updateTask({ variables: { id: task.id, input: { completed: !task.completed } } })}
        disabled={isBusy}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: task.completed, disabled: isBusy }}
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Pressable disabled={isBusy} onPress={() => deleteTask({ variables: { id: task.id } })}>
        <Text>{deleteLoading ? 'Deleting...' : 'Delete'}</Text>
      </Pressable>

      {updateError && <Text>Couldn't update task: {updateError.message}</Text>}
      {deleteError && <Text>Couldn't delete task: {deleteError.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  checkmark: { color: 'white', fontWeight: '700' },
  completedText: { textDecorationLine: 'line-through', color: 'grey' },
})
