import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, dimen } from '@/design';

import { AppText } from '../ui/AppText';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Tap on backdrop / Android back closes the sheet. Default `true`. */
  dismissible?: boolean;
  children: ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Base bottom sheet — like Flutter `showModalBottomSheet`.
 * Build specific sheets (filter, image picker, …) on top of this in this folder.
 */
export function BottomSheet({ visible, onClose, title, dismissible = true, children }: Props) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, bounciness: 0 }).start();
    } else if (mounted) {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
        setMounted(false),
      );
    }
  }, [visible, mounted, anim]);

  const close = () => dismissible && onClose();

  return (
    <Modal visible={mounted} transparent statusBarTranslucent onRequestClose={close}>
      <Animated.View style={[styles.backdrop, { opacity: anim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + dimen.defaultSpace },
          {
            transform: [
              {
                translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT, 0] }),
              },
            ],
          },
        ]}
      >
        <View style={styles.handle} />
        {title ? (
          <AppText variant="title" style={styles.title}>
            {title}
          </AppText>
        ) : null}
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: dimen.largeSpace,
    borderTopRightRadius: dimen.largeSpace,
    paddingHorizontal: dimen.defaultSpace,
    paddingTop: dimen.smallSpace,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: dimen.mediumSpace,
  },
  title: { marginBottom: dimen.mediumSpace },
});
