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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='new-task'>New task</label>
        <input
          id='new-task'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='New task'
        />
        <button type='submit' disabled={addLoading}>
          {addLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {addError && <p>Couldn't add task: {addError.message}</p>}

      {data?.allTasks.length === 0 ? (
        <p>No tasks yet. Add your first one above.</p>
      ) : (
        <ul>
          {data?.allTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  )
}
