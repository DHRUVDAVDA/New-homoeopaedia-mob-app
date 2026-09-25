export enum UserActionTypes {
  LOGIN = 'USER/LOGIN',
  LOGOUT = 'USER/LOGOUT',
  UPDATE_PROFILE = 'USER/UPDATE_PROFILE',
}

export enum PurchaseActionTypes {
  SET_SUPPORTS_IAP = 'PURCHASE/SET_SUPPORTS_IAP',
  SET_IS_PURCHASED = 'PURCHASE/SET_IS_PURCHASED',
  SET_PURCHASE_LOADING = 'PURCHASE/SET_PURCHASE_LOADING',
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

export interface PurchaseState {
  supportsInAppPurchase: boolean
  isPurchased: boolean
  isLoading: boolean
}
