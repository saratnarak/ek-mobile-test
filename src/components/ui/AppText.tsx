import { Text, type TextProps } from 'react-native';

import { textStyles, type TextVariant } from '@/design';

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
};

/** Text with app styles: `<AppText variant="title">Hello</AppText>` */
export function AppText({ variant = 'body', color, style, ...rest }: Props) {
  return <Text style={[textStyles[variant], color ? { color } : null, style]} {...rest} />;
}
