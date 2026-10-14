import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/ui';
import { colors, dimen } from '@/design';

export type OrdersScreenProps = {
  onActionPress?: () => void;
  onScanQr?: () => void;
};

export function OrdersScreen({ onActionPress, onScanQr }: OrdersScreenProps = {}) {
  const { t } = useTranslation();
  const handlePress = onActionPress ?? onScanQr ?? (() => {});

  return (
    <View style={styles.container}>
      <AppText variant="title" style={styles.title}>
        {t('orders.emptyTitle')}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.message}>
        {t('orders.emptyMessage')}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('orders.scanTableQr')}
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <AppText variant="button">{t('orders.scanTableQr')}</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: dimen.largeSpace,
  },
  title: {
    marginBottom: dimen.smallSpace,
    textAlign: 'center',
  },
  message: {
    marginBottom: dimen.largeSpace,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: dimen.mediumRadius,
    height: 48,
    paddingHorizontal: dimen.largeSpace,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
});

