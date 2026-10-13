import { Modal, StyleSheet, View } from 'react-native';

import { colors, dimen, shadow } from '@/design';

import { ProgressBar } from '../ui/ProgressBar';
import { createModalController, useModalVisible } from './modalController';

/**
 * Blocking loading dialog.
 *
 * ```ts
 * progressDialog.show();
 * await api.call();
 * progressDialog.dismiss();
 * ```
 */
export const progressDialog = createModalController();

/** Rendered by `<DialogHost />`. */
export function ProgressDialog() {
  const visible = useModalVisible(progressDialog);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      // Flutter: PopScope(canPop: true) — Android back closes it.
      onRequestClose={progressDialog.dismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ProgressBar type="circle" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 88,
    height: 88,
    borderRadius: dimen.mediumRadius,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.default,
  },
});
