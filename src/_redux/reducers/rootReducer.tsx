import { Reducer } from 'redux'
import { UserActionTypes, UserState } from './types'

export const initialState: UserState = {
  user: {},
  token: '',
  isAuthenticated: false,
}

const rootReducer: Reducer<UserState> = (
  state: UserState = initialState,
  action,
) => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      const { isAuthenticated, user, token } = action.payload
      return {
        ...state,
        isAuthenticated,
        user,
        token,
      }
    case UserActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        token: '',
      }
    case UserActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default rootReducer
