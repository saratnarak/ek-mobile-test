import type { TextStyle, ViewStyle } from 'react-native';

import { colors } from './colors';
import { dimen } from './dimen';

/** Text styles — like Flutter `TextStyle` helpers. Sizes come from `dimen`. */
export const textStyles = {
  largeTitle: { fontSize: dimen.largeTitleTextSize, fontWeight: '700', color: colors.text },
  title: { fontSize: dimen.titleTextSize, fontWeight: '600', color: colors.text },
  body: { fontSize: dimen.bodyTextSize, fontWeight: '400', color: colors.text },
  bodyBold: { fontSize: dimen.bodyTextSize, fontWeight: '600', color: colors.text },
  caption: { fontSize: dimen.captionTextSize, fontWeight: '400', color: colors.textSecondary },
  button: { fontSize: dimen.buttonTextSize, fontWeight: '600', color: colors.textInverse },
  price: { fontSize: dimen.titleTextSize, fontWeight: '700', color: colors.primary },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textStyles;

/** Shadow — like Flutter `elevation` / `BoxShadow`. */
export const shadow = {
  small: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: dimen.defaultElevation,
    shadowOffset: { width: 0, height: 4 },
    elevation: dimen.defaultElevation,
  },
} satisfies Record<string, ViewStyle>;

/** Card style — like Flutter card `BoxDecoration`. */
export const cardStyle: ViewStyle = {
  backgroundColor: colors.background,
  borderRadius: dimen.defaultRadius,
  padding: dimen.contentPadding,
  ...shadow.small,
};
