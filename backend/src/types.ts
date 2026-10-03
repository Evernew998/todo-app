export type User = {
  id: string
  email: string
  password: string
}
export type PublicUser = Omit<User, 'password'>

export type Context = {
  user: PublicUser | null
  token: string | null
}
