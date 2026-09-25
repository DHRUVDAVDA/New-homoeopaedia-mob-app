import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { WEB_URL } from '../consts';
import { PurchaseActionTypes } from '../_redux/reducers/types';
import { fetchSupportedVersions, fetchIsPurchased, savePurchase } from './PurchaseRepository';

/**
 * Called once at app launch (Home.tsx useEffect).
 * Determines supportsInAppPurchase based on Firebase version list,
 * and loads isPurchased from Firebase for the authenticated user.
 */
export const initializePurchaseState = async (
  userId: number | string | undefined,
  dispatch: any
): Promise<void> => {
  dispatch({ type: PurchaseActionTypes.SET_PURCHASE_LOADING, payload: true });

  try {
    // 1. Check if this iOS version supports IAP
    let supportsIAP = false;

    if (Platform.OS === 'ios') {
      const currentVersion = String(
        Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? ''
      ).trim();

      const supportedVersions = await fetchSupportedVersions();
      supportsIAP = supportedVersions.includes(currentVersion);
    }

    dispatch({ type: PurchaseActionTypes.SET_SUPPORTS_IAP, payload: supportsIAP });

    if (supportsIAP) {
      // IAP is active on this version — check Firebase for this user's purchase
      if (userId) {
        const isPurchased = await fetchIsPurchased(userId);
        dispatch({ type: PurchaseActionTypes.SET_IS_PURCHASED, payload: isPurchased });
      }
    } else {
      // IAP not supported on this version — local isPurchased flag means nothing
      dispatch({ type: PurchaseActionTypes.SET_IS_PURCHASED, payload: false });
    }
  } catch (error) {
    console.error('[PurchaseService] initializePurchaseState error:', error);
    // Defaults remain: supportsInAppPurchase=false, isPurchased=false
  } finally {
    dispatch({ type: PurchaseActionTypes.SET_PURCHASE_LOADING, payload: false });
  }
};

/**
 * Called by any premium CTA button across the app.
 *
 * - supportsInAppPurchase = false  → opens existing Razorpay/web flow (unchanged)
 * - supportsInAppPurchase = true   → opens the Premium Purchase Modal
 *
 * @param supportsInAppPurchase - read from Redux purchaseReducer
 * @param showModal - callback to open PremiumPurchaseModal from the calling screen
 */
export const openPurchaseCTA = (
  supportsInAppPurchase: boolean,
  showModal: () => void
): void => {
  if (supportsInAppPurchase) {
    showModal();
  } else {
    Linking.openURL(`${WEB_URL}/plans`);
  }
};

