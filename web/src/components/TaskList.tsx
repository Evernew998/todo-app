import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_TASKS, ADD_TASK } from '../graphql/tasks'
import TaskItem from './TaskItem'

export default function TaskList() {
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

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!text.trim()) return

    addTask({ variables: { task: { text, completed: false } } })
    setText('')
  }

  if (loading) return <p className='text-center text-sm text-slate-500'>Loading...</p>
  if (error)
    return <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>Error: {error.message}</p>

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 sm:flex-row'>
        <label htmlFor='new-task' className='sr-only'>
          New task
        </label>
        <input
          id='new-task'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='New task'
          className='min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20'
        />
        <button
          type='submit'
          disabled={addLoading}
          className='shrink-0 rounded-lg bg-blue-600 px-4 py-2 w-fit font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer'
        >
          {addLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {addError && (
        <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
          Couldn't add task: {addError.message}
        </p>
      )}

      {data?.allTasks.length === 0 ? (
        <p className='mt-6 text-center text-sm text-slate-500'>
          No tasks yet. Add your first one above.
        </p>
      ) : (
        <ul className='mt-6 space-y-2'>
          {data?.allTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  )
}
