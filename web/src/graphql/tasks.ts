import { graphql } from '../gql'

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
