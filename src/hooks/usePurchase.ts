import { useSelector, useDispatch } from 'react-redux';
import { openPurchaseCTA } from '../services/PurchaseService';

interface UsePurchaseResult {
  supportsInAppPurchase: boolean;
  isPurchased: boolean;
  isLoading: boolean;
  /**
   * Call this from any premium CTA button.
   * Passes showModal so the hook can open the PremiumPurchaseModal
   * when IAP is enabled, or open the web URL otherwise.
   */
  triggerPurchase: (showModal: () => void) => void;
}

/**
 * Custom hook that exposes purchase state from Redux and
 * a unified `triggerPurchase` function for all premium CTAs.
 */
const usePurchase = (): UsePurchaseResult => {
  const dispatch = useDispatch();
  const { supportsInAppPurchase, isPurchased, isLoading } = useSelector(
    (state: any) => state.purchaseReducer
  );

  const triggerPurchase = (showModal: () => void) => {
    openPurchaseCTA(supportsInAppPurchase, showModal);
  };

  return {
    supportsInAppPurchase,
    isPurchased,
    isLoading,
    triggerPurchase,
  };
};

export default usePurchase;
