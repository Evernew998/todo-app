import { useMutation } from '@apollo/client/react'
import { type Task, UPDATE_TASK, DELETE_TASK } from '../graphql/tasks'

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
    <li>
      <div>
        <input
          type='checkbox'
          id={task.id}
          checked={task.completed}
          onChange={() =>
            updateTask({ variables: { id: task.id, input: { completed: !task.completed } } })
          }
          disabled={isBusy}
        />
        <label htmlFor={task.id}>{task.text}</label>
      </div>

      <button
        disabled={isBusy}
        onClick={() => {
          if (confirm('Confirm to delete task?')) deleteTask({ variables: { id: task.id } })
        }}
      >
        {deleteLoading ? 'Deleting...' : 'Delete'}
      </button>
      {updateError && <p>Couldn't update task: {updateError.message}</p>}
      {deleteError && <p>Couldn't delete task: {deleteError.message}</p>}
    </li>
  )
}
