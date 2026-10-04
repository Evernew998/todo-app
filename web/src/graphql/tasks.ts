import { graphql } from '../gql'
import type { GetTasksQuery } from '../gql/graphql'

export type Task = GetTasksQuery['allTasks'][number]

export const GET_TASKS = graphql(`
  query GetTasks {
    allTasks {
      id
      text
      completed
    }
  }
`)

export const ADD_TASK = graphql(`
  mutation AddTask($task: TaskInput!) {
    addTask(task: $task) {
      id
      text
      completed
    }
  }
`)

export const DELETE_TASK = graphql(`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`)

export const UPDATE_TASK = graphql(`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      text
      completed
    }
  }
`)
