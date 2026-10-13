import { View, type ViewProps } from 'react-native';

import { cardStyle } from '@/design';

/** Card with app styles: `<Card>...</Card>` */
export function Card({ style, ...rest }: ViewProps) {
  return <View style={[cardStyle, style]} {...rest} />;
}
