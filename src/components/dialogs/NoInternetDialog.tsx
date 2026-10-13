import NetInfo from '@react-native-community/netinfo';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, dimen, shadow } from '@/design';

import { AppText } from '../ui/AppText';
import { createModalController, useModalVisible } from './modalController';

/**
 * Non-dismissible "No Internet" dialog. `<DialogHost />` shows it automatically
 * when the device goes offline; you can also call `noInternetDialog.show()`.
 */
export const noInternetDialog = createModalController();

/** Rendered by `<DialogHost />`. */
export function NoInternetDialog() {
  const visible = useModalVisible(noInternetDialog);
  const [checking, setChecking] = useState(false);

  const onRefresh = async () => {
    setChecking(true);
    try {
      const state = await NetInfo.refresh();
      if (state.isConnected === false) return;
      noInternetDialog.dismiss();
    } finally {
      setChecking(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      // Flutter: PopScope(canPop: false) — Android back does nothing.
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <WifiOffIcon />

          <AppText variant="title" style={styles.title}>
            No Internet Connection
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.message}>
            Please check your internet connection
          </AppText>

          <Pressable
            onPress={onRefresh}
            disabled={checking}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            {checking ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <AppText variant="button">Refresh</AppText>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/** Dependency-free wifi-off glyph (replaces the Lottie animation). */
function WifiOffIcon() {
  const arcs = [56, 38, 20];
  return (
    <View style={styles.iconCircle}>
      <View style={styles.iconBox}>
        {arcs.map((d) => (
          <View
            key={d}
            style={[
              styles.arc,
              { width: d, height: d, borderRadius: d / 2, top: 34 - d / 2 + 6 },
            ]}
          />
        ))}
        <View style={styles.dot} />
        <View style={styles.slash} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: dimen.largeSpace,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: dimen.largeSpace,
    padding: dimen.largeSpace,
    alignItems: 'center',
    ...shadow.default,
  },
  title: { marginTop: dimen.defaultSpace, marginBottom: dimen.smallSpace, textAlign: 'center' },
  message: { textAlign: 'center' },
  button: {
    alignSelf: 'stretch',
    height: 56,
    marginTop: dimen.defaultSpace,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { backgroundColor: colors.primaryDark },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: { width: 56, height: 48, alignItems: 'center' },
  arc: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  slash: {
    position: 'absolute',
    top: 22,
    width: 62,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.danger,
    transform: [{ rotate: '45deg' }],
  },
});
