import TaskList from '../components/TaskList'
import LogoutButton from '../components/LogoutButton'

export default function TasksPage() {
  return (
    <main className='flex items-start justify-center p-4 min-h-screen bg-slate-50'>
      <div className='p-8 w-full max-w-4xl rounded-2xl bg-white shadow-lg'>
        <header className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-slate-900'>My Tasks</h1>
          <LogoutButton />
        </header>

        <div className='mt-6'>
          <TaskList />
        </div>
      </div>
    </main>
  )
}
