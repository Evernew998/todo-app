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
    <li className='rounded-lg border border-slate-200 px-3 py-2'>
      <div className='flex items-center gap-3'>
        <input
          type='checkbox'
          id={task.id}
          checked={task.completed}
          onChange={() =>
            updateTask({ variables: { id: task.id, input: { completed: !task.completed } } })
          }
          disabled={isBusy}
          className='h-4 w-4 shrink-0 cursor-pointer accent-blue-600 disabled:opacity-50'
        />
        <label
          htmlFor={task.id}
          className={`min-w-0 flex-1 cursor-pointer wrap-break-word ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}
        >
          {task.text}
        </label>
      </div>

      <button
        disabled={isBusy}
        onClick={() => {
          if (confirm('Confirm to delete task?')) deleteTask({ variables: { id: task.id } })
        }}
        className='shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer'
      >
        {deleteLoading ? 'Deleting...' : 'Delete'}
      </button>
      {updateError && (
        <p className='mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
          Couldn't update task: {updateError.message}
        </p>
      )}
      {deleteError && (
        <p className='mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
          Couldn't delete task: {deleteError.message}
        </p>
      )}
    </li>
  )
}
