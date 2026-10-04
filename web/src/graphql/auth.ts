import { graphql } from '../gql'

export const LOGIN = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`)

export const SIGNUP = graphql(`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`)

export const LOGOUT = graphql(`
  mutation Logout {
    logout
  }
`)
