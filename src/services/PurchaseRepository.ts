import database from '@react-native-firebase/database';

export interface PurchaseRecord {
  isPurchased: boolean;
  purchaseDate?: string;
  transactionId?: string;
  originalTransactionId?: string;
  productId?: string;
  platform?: string;
  appVersion?: string;
  buildNumber?: string;
  purchaseState?: string;
  updatedAt?: string;
}

/**
 * Fetches the list of app versions that support Apple In-App Purchase
 * from /flags/inAppPurchaseVersions in Firebase Realtime Database.
 */
export const fetchSupportedVersions = async (): Promise<string[]> => {
  try {
    const snapshot = await database()
      .ref('/flags/inAppPurchaseVersions')
      .once('value');
    const val = snapshot.val();

    if (Array.isArray(val)) {
      return val.map((v: any) => String(v).trim());
    }

    // Handle Firebase object (0-indexed keys) instead of array
    if (val && typeof val === 'object') {
      return Object.values(val).map((v: any) => String(v).trim());
    }

    return [];
  } catch (error) {
    console.error('[PurchaseRepository] fetchSupportedVersions error:', error);
    return [];
  }
};

/**
 * Fetches isPurchased status for a user from /purchases/{userId}/isPurchased
 */
export const fetchIsPurchased = async (userId: number | string): Promise<boolean> => {
  try {
    const snapshot = await database()
      .ref(`/purchases/${userId}/isPurchased`)
      .once('value');
    return snapshot.val() === true;
  } catch (error) {
    console.error('[PurchaseRepository] fetchIsPurchased error:', error);
    return false;
  }
};

/**
 * Saves a full Apple IAP purchase record to /purchases/{userId}
 * Stores every useful field for restore, validation, analytics, and debugging.
 */
export const savePurchase = async (
  userId: number | string,
  purchaseData: Omit<PurchaseRecord, 'isPurchased'> & { rawReceipt?: string }
): Promise<void> => {
  try {
    const record: PurchaseRecord & { rawReceipt?: string } = {
      isPurchased: true,
      ...purchaseData,
      updatedAt: new Date().toISOString(),
    };
    await database().ref(`/purchases/${userId}`).set(record);
    console.log('[PurchaseRepository] Purchase saved for user:', userId);
  } catch (error) {
    console.error('[PurchaseRepository] savePurchase error:', error);
    throw error;
  }
};
