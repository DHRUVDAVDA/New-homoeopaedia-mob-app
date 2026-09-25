import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { useIAP, ErrorCode, finishTransaction, getAvailablePurchases } from 'react-native-iap';
import Constants from 'expo-constants';
import { theme_clr } from '../constants/colors';
import { bold, regular, semi_bold } from '../constants/font';
import { IAP_PRODUCT_ID } from '../services/IAPService';
import { PurchaseActionTypes } from '../_redux/reducers/types';
import { savePurchase } from '../services/PurchaseRepository';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  dispatch: any;
};

const BENEFITS = [
  { icon: 'clipboard-list', text: 'Unlimited Mock Tests & Analytics', subtitle: 'Practice with latest exam pattern questions' },
  { icon: 'video', text: 'Premium Video Lectures', subtitle: 'Comprehensive subject & topic explanations' },
  { icon: 'book-open', text: 'Premium Study Material & Notes', subtitle: 'Detailed solutions crafted by top experts' },
  { icon: 'star', text: 'Future Premium Updates & Content', subtitle: 'Continuous access to new additions' },
];

const PremiumPurchaseModal = ({ visible, onClose, onSuccess, dispatch }: Props) => {
  const [purchasing, setPurchasing] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const user = useSelector((state: any) => state.authReducer.user);

  const {
    products,
    fetchProducts,
    requestPurchase,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        // 1. Finish the transaction with Apple
        await finishTransaction({ purchase, isConsumable: false });

        // 2. Save to Firebase (keyed by user_id)
        if (!user?.user_id) {
          console.error('[PremiumPurchaseModal] Cannot save purchase – user_id is missing');
          throw new Error('user_id is required to save purchase');
        }
        await savePurchase(user.user_id, {
          transactionId: purchase.transactionId,
          originalTransactionId: (purchase as any).originalTransactionId,
          productId: purchase.productId ?? IAP_PRODUCT_ID,
          platform: 'ios',
          appVersion: String(Constants.expoConfig?.version ?? ''),
          buildNumber: String(
            Constants.expoConfig?.ios?.buildNumber ??
            Constants.nativeBuildVersion ?? ''
          ),
          purchaseDate: purchase.transactionDate
            ? new Date(purchase.transactionDate).toISOString()
            : new Date().toISOString(),
          purchaseState: 'purchased',
          rawReceipt: (purchase as any).transactionReceipt,
          updatedAt: new Date().toISOString(),
        });

        // 3. Update Redux
        dispatch({ type: PurchaseActionTypes.SET_IS_PURCHASED, payload: true });

        onClose();
        Alert.alert(
          '🎉 Welcome to Premium!',
          'Your purchase was successful. All premium features are now unlocked.',
          [{ text: 'OK', onPress: () => onSuccess?.() }]
        );
      } catch (err) {
        console.error('[PremiumPurchaseModal] onPurchaseSuccess error:', err);
        Alert.alert('Purchase Error', 'Purchase succeeded but we could not activate your account. Please contact support.');
      } finally {
        setPurchasing(false);
      }
    },
    onPurchaseError: (error) => {
      setPurchasing(false);
      if (error.code === ErrorCode.UserCancelled) return;
      if (error.message?.includes('SKU not found')) {
        Alert.alert(
          'In-App Purchase Unavailable',
          'In-App Purchase is currently being configured on the App Store. Please try again shortly.'
        );
      } else {
        Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
      }
    },
  });

  // Fetch product details whenever the modal opens
  useEffect(() => {
    if (visible) {
      setLoadingProduct(true);
      fetchProducts({ skus: [IAP_PRODUCT_ID] })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoadingProduct(false));
    } else {
      setLoadingProduct(false);
    }
  }, [visible]);

  const product = products?.[0] as any;
  // product.id is used in rn-iap v16, product.productId in older versions
  const productSku = product?.id ?? product?.productId ?? IAP_PRODUCT_ID;

  const handlePurchase = async () => {
    if (!product) {
      Alert.alert('Not Available', 'Product details could not be loaded. Please try again.');
      return;
    }
    setPurchasing(true);
    try {
      await requestPurchase({
        request: {
          apple: { sku: productSku },
        },
        type: 'in-app',
      });
    } catch (err: any) {
      // onPurchaseError handles this, but catch synchronous throws just in case
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const purchases = await getAvailablePurchases();
      const restored = purchases.find(
        (p) => (p as any).productId === IAP_PRODUCT_ID || (p as any).id === IAP_PRODUCT_ID
      );
      if (restored) {
        if (!user?.user_id) throw new Error('user_id is required to restore purchase');
        await savePurchase(user.user_id, {
          transactionId: restored.transactionId,
          originalTransactionId: (restored as any).originalTransactionId,
          productId: IAP_PRODUCT_ID,
          platform: 'ios',
          appVersion: String(Constants.expoConfig?.version ?? ''),
          buildNumber: String(
            Constants.expoConfig?.ios?.buildNumber ??
            Constants.nativeBuildVersion ?? ''
          ),
          purchaseDate: restored.transactionDate
            ? new Date(restored.transactionDate).toISOString()
            : new Date().toISOString(),
          purchaseState: 'restored',
          rawReceipt: (restored as any).transactionReceipt,
        });
        dispatch({ type: PurchaseActionTypes.SET_IS_PURCHASED, payload: true });
        onClose();
        Alert.alert('✅ Purchase Restored', 'Your premium access has been restored successfully.');
      } else {
        Alert.alert('No Purchase Found', 'We could not find a previous purchase for this account.');
      }
    } catch (err: any) {
      console.error('[PremiumPurchaseModal] handleRestore error:', err);
      Alert.alert('Restore Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          {/* Top Handle */}
          <View style={styles.handle} />

          <View style={{ marginHorizontal: 20 }}>
            {/* Crown Badge & Close Button Header */}
            <View style={styles.header}>
              <View style={styles.crownBadge}>
                <FontAwesome5 name="crown" size={moderateScale(18)} color="#D4AF37" />
                <Text style={styles.crownTagText}>PREMIUM PLAN</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                disabled={purchasing}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome5 name="times" size={moderateScale(16)} color="#777777" />
              </TouchableOpacity>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.title}>Unlock Full Access</Text>
            <Text style={styles.subtitle}>
              Get unlimited access to all premium tests, video lectures, and study material.
            </Text>

            {/* Benefits Cards */}
            <View style={styles.benefitsContainer}>
              {BENEFITS.map((b, i) => (
                <View key={i} style={styles.benefitCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5
                      name={b.icon as any}
                      size={moderateScale(14)}
                      color={theme_clr}
                    />
                  </View>
                  <View style={styles.benefitTextContainer}>
                    <Text style={styles.benefitTitle}>{b.text}</Text>
                    <Text style={styles.benefitSubtitle}>{b.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Price Card */}
            {loadingProduct ? (
              <View style={styles.priceCard}>
                <ActivityIndicator size="small" color={theme_clr} />
                <Text style={styles.priceLoadingText}>Fetching price...</Text>
              </View>
            ) : product ? (
              <View style={styles.priceCard}>
                <View style={styles.priceLeft}>
                  <Text style={styles.priceLabel}>One-Time Purchase</Text>
                  <Text style={styles.priceTitle}>{product.title ?? 'Homoeopaedia Premium'}</Text>
                  {product.description ? (
                    <Text style={styles.priceDesc}>{product.description}</Text>
                  ) : null}
                </View>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceAmount}>{product.localizedPrice ?? product.price}</Text>
                  <Text style={styles.priceNote}>lifetime</Text>
                </View>
              </View>
            ) : null}

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.purchaseBtn, (purchasing || loadingProduct) && styles.purchaseBtnDisabled]}
              onPress={handlePurchase}
              disabled={purchasing || loadingProduct}
              activeOpacity={0.85}
            >
              {purchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.purchaseBtnContent}>
                  <Text style={styles.purchaseBtnText}>
                    {product?.localizedPrice
                      ? `Get Premium • ${product.localizedPrice}`
                      : 'Get Premium'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Restore Purchase */}
            <TouchableOpacity
              style={[styles.restoreBtn, (purchasing || restoring) && styles.purchaseBtnDisabled]}
              onPress={handleRestore}
              disabled={purchasing || restoring}
            >
              {restoring ? (
                <ActivityIndicator size="small" color={theme_clr} />
              ) : (
                <Text style={styles.restoreText}>Restore Purchase</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <TouchableOpacity style={styles.laterBtn} onPress={onClose} disabled={purchasing || restoring}>
              <Text style={styles.laterText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  crownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  crownTagText: {
    fontFamily: bold,
    fontSize: moderateScale(11),
    color: '#B8860B',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: bold,
    fontSize: moderateScale(21),
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: regular,
    fontSize: moderateScale(13),
    color: '#666666',
    marginBottom: 18,
    lineHeight: 19,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: semi_bold,
    fontSize: moderateScale(13),
    color: '#222222',
  },
  benefitSubtitle: {
    fontFamily: regular,
    fontSize: moderateScale(11),
    color: '#777777',
    marginTop: 2,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F7FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CCE4FF',
  },
  priceLeft: {
    flex: 1,
    paddingRight: 10,
  },
  priceLabel: {
    fontFamily: regular,
    fontSize: moderateScale(10),
    color: '#5A8DBE',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceTitle: {
    fontFamily: semi_bold,
    fontSize: moderateScale(13),
    color: '#1A1A1A',
  },
  priceDesc: {
    fontFamily: regular,
    fontSize: moderateScale(11),
    color: '#777777',
    marginTop: 2,
  },
  priceBadge: {
    alignItems: 'center',
    backgroundColor: theme_clr,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  priceAmount: {
    fontFamily: bold,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
  priceNote: {
    fontFamily: regular,
    fontSize: moderateScale(9),
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  priceLoadingText: {
    fontFamily: regular,
    fontSize: moderateScale(12),
    color: '#999999',
    marginLeft: 8,
  },
  purchaseBtn: {
    backgroundColor: theme_clr,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: theme_clr,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  purchaseBtnDisabled: {
    opacity: 0.65,
  },
  purchaseBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleIcon: {
    marginRight: 8,
  },
  purchaseBtnText: {
    fontFamily: bold,
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
  restoreBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme_clr,
    borderRadius: 10,
    marginBottom: 8,
  },
  restoreText: {
    fontFamily: semi_bold,
    fontSize: moderateScale(13),
    color: theme_clr,
  },
  laterBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  laterText: {
    fontFamily: regular,
    fontSize: moderateScale(12),
    color: '#999999',
    textDecorationLine: 'underline',
  },
});

export default PremiumPurchaseModal;
