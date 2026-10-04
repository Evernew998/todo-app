import TaskList from '../components/TaskList'
import LogoutButton from '../components/LogoutButton'

export default function TasksPage() {
  return (
    <main>
      <header>
        <h1>My Tasks</h1>
        <LogoutButton />
      </header>
      <TaskList />
    </main>
  )
}
