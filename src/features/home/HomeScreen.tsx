import { ScrollView, StyleSheet } from 'react-native';

import { colors, dimen } from '@/design';

export function HomeScreen() {
  return <ScrollView contentContainerStyle={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    padding: dimen.defaultSpace,
    backgroundColor: colors.surface,
    flexGrow: 1,
  },
});

