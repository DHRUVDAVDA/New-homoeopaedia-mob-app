export enum UserActionTypes {
  LOGIN = 'USER/LOGIN',
  LOGOUT = 'USER/LOGOUT',
  UPDATE_PROFILE = 'USER/UPDATE_PROFILE',
}

export interface User {
  user_id?: number
  user_name?: string
  user_email?: string
  user_phone?: string
  user_college?: string
  user_state?: string
  user_year?: string
}

export interface UserState {
  user?: User
  token?: string
  isAuthenticated: boolean
}
