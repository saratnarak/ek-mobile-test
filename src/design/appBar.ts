import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { colors } from './colors';
import { dimen } from './dimen';

/**
 * Shared app bar (header) style — like Flutter `AppBarTheme`.
 * Spread into any navigator's `screenOptions`.
 */
export const appBarOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.textInverse,
  headerTitleStyle: { fontSize: dimen.titleTextSize, fontWeight: '600' },
  headerTitleAlign: 'center',
  headerShadowVisible: false,
} satisfies NativeStackNavigationOptions & BottomTabNavigationOptions;
