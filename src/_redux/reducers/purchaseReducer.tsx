import { Reducer } from 'redux'
import { PurchaseActionTypes, PurchaseState } from './types'

export const purchaseInitialState: PurchaseState = {
  supportsInAppPurchase: false,
  isPurchased: false,
  isLoading: true,
}

const purchaseReducer: Reducer<PurchaseState> = (
  state: PurchaseState = purchaseInitialState,
  action,
): PurchaseState => {
  switch (action.type) {
    case PurchaseActionTypes.SET_SUPPORTS_IAP:
      return {
        ...state,
        supportsInAppPurchase: action.payload,
      }
    case PurchaseActionTypes.SET_IS_PURCHASED:
      return {
        ...state,
        isPurchased: action.payload,
      }
    case PurchaseActionTypes.SET_PURCHASE_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

export default purchaseReducer
